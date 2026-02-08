import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { validateProfile, type ProfileValidationErrors } from './validateProfile';
import { Plus, X, Loader2, Globe, Lock } from 'lucide-react';
import type { SerializableUserProfile } from '../../backend';
import { ProfileVisibility } from '../../backend';

interface ProfileFormProps {
  initialProfile?: SerializableUserProfile | null;
  onSave: (profile: SerializableUserProfile) => Promise<void>;
  isSaving: boolean;
}

export default function ProfileForm({ initialProfile, onSave, isSaving }: ProfileFormProps) {
  const [displayName, setDisplayName] = useState(initialProfile?.displayName || '');
  const [bio, setBio] = useState(initialProfile?.bio || '');
  const [socialLinks, setSocialLinks] = useState<string[]>(
    initialProfile?.socialLinks.length ? initialProfile.socialLinks : ['']
  );
  const [visibility, setVisibility] = useState<ProfileVisibility>(
    initialProfile?.visibility || ProfileVisibility.publicVisibility
  );
  const [activityInterests, setActivityInterests] = useState(initialProfile?.activityInterests || '');
  const [skills, setSkills] = useState(initialProfile?.skills || '');
  const [currentProjects, setCurrentProjects] = useState(initialProfile?.currentProjects || '');
  const [programmingLanguages, setProgrammingLanguages] = useState(initialProfile?.programmingLanguages || '');
  const [number, setNumber] = useState(initialProfile?.number || '');
  const [errors, setErrors] = useState<ProfileValidationErrors>({});

  const isPublic = visibility === ProfileVisibility.publicVisibility;

  const handleAddLink = () => {
    setSocialLinks([...socialLinks, '']);
  };

  const handleRemoveLink = (index: number) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index));
  };

  const handleLinkChange = (index: number, value: string) => {
    const newLinks = [...socialLinks];
    newLinks[index] = value;
    setSocialLinks(newLinks);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Filter out empty links
    const filteredLinks = socialLinks.filter((link) => link.trim());

    // Validate
    const validationErrors = validateProfile(
      displayName,
      bio,
      filteredLinks,
      visibility,
      isPublic ? activityInterests : '',
      isPublic ? skills : '',
      isPublic ? currentProjects : '',
      isPublic ? programmingLanguages : '',
      isPublic ? number : ''
    );
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const profile: SerializableUserProfile = {
      displayName: displayName.trim(),
      bio: bio.trim(),
      socialLinks: filteredLinks,
      visibility,
      activityInterests: isPublic ? activityInterests.trim() : '',
      skills: isPublic ? skills.trim() : '',
      currentProjects: isPublic ? currentProjects.trim() : '',
      programmingLanguages: isPublic ? programmingLanguages.trim() : '',
      number: isPublic ? number.trim() : '',
    };

    await onSave(profile);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Your Profile</CardTitle>
        <CardDescription>
          Set up your profile to let others know who you are
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Display Name */}
          <div className="space-y-2">
            <Label htmlFor="displayName">
              Display Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your display name"
              className={errors.displayName ? 'border-destructive' : ''}
            />
            {errors.displayName && (
              <p className="text-sm text-destructive">{errors.displayName}</p>
            )}
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              rows={4}
              className={errors.bio ? 'border-destructive' : ''}
            />
            <p className="text-xs text-muted-foreground">
              {bio.length}/500 characters
            </p>
            {errors.bio && <p className="text-sm text-destructive">{errors.bio}</p>}
          </div>

          {/* Social Links */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Social Links</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddLink}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Link
              </Button>
            </div>
            <div className="space-y-3">
              {socialLinks.map((link, index) => (
                <div key={index} className="flex gap-2">
                  <div className="flex-1 space-y-1">
                    <Input
                      value={link}
                      onChange={(e) => handleLinkChange(index, e.target.value)}
                      placeholder="https://example.com/yourprofile"
                      className={
                        errors.socialLinks?.[index] ? 'border-destructive' : ''
                      }
                    />
                    {errors.socialLinks?.[index] && (
                      <p className="text-sm text-destructive">
                        {errors.socialLinks[index]}
                      </p>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveLink(index)}
                    className="shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Profile Visibility */}
          <div className="space-y-3 pt-4 border-t">
            <Label>Profile Visibility</Label>
            <RadioGroup
              value={visibility}
              onValueChange={(value) => setVisibility(value as ProfileVisibility)}
              className="space-y-3"
            >
              <div className="flex items-start space-x-3 space-y-0">
                <RadioGroupItem value={ProfileVisibility.publicVisibility} id="public" />
                <div className="space-y-1 leading-none">
                  <Label htmlFor="public" className="cursor-pointer flex items-center gap-2 font-medium">
                    <Globe className="h-4 w-4" />
                    Public
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Your full profile and business information will be visible to all members
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 space-y-0">
                <RadioGroupItem value={ProfileVisibility.privateVisibility} id="private" />
                <div className="space-y-1 leading-none">
                  <Label htmlFor="private" className="cursor-pointer flex items-center gap-2 font-medium">
                    <Lock className="h-4 w-4" />
                    Private
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Only basic information will be visible to other members
                  </p>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Business Information - Only shown for Public profiles */}
          {isPublic && (
            <div className="space-y-6 pt-4 border-t">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Business Information</h3>
                <p className="text-sm text-muted-foreground">
                  Share more about your business and professional details
                </p>
              </div>

              {/* Business name */}
              <div className="space-y-2">
                <Label htmlFor="skills">Business name</Label>
                <Textarea
                  id="skills"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="Enter your business name..."
                  rows={3}
                  className={errors.skills ? 'border-destructive' : ''}
                />
                {errors.skills && <p className="text-sm text-destructive">{errors.skills}</p>}
              </div>

              {/* Slogan */}
              <div className="space-y-2">
                <Label htmlFor="programmingLanguages">Slogan</Label>
                <Input
                  id="programmingLanguages"
                  value={programmingLanguages}
                  onChange={(e) => setProgrammingLanguages(e.target.value)}
                  placeholder="Enter your business slogan..."
                  className={errors.programmingLanguages ? 'border-destructive' : ''}
                />
                {errors.programmingLanguages && (
                  <p className="text-sm text-destructive">{errors.programmingLanguages}</p>
                )}
              </div>

              {/* Business Description */}
              <div className="space-y-2">
                <Label htmlFor="currentProjects">Business Description</Label>
                <Textarea
                  id="currentProjects"
                  value={currentProjects}
                  onChange={(e) => setCurrentProjects(e.target.value)}
                  placeholder="Describe your business and what you do..."
                  rows={3}
                  className={errors.currentProjects ? 'border-destructive' : ''}
                />
                {errors.currentProjects && (
                  <p className="text-sm text-destructive">{errors.currentProjects}</p>
                )}
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="activityInterests">Location</Label>
                <Textarea
                  id="activityInterests"
                  value={activityInterests}
                  onChange={(e) => setActivityInterests(e.target.value)}
                  placeholder="Where is your business located?"
                  rows={3}
                  className={errors.activityInterests ? 'border-destructive' : ''}
                />
                {errors.activityInterests && (
                  <p className="text-sm text-destructive">{errors.activityInterests}</p>
                )}
              </div>

              {/* Number */}
              <div className="space-y-2">
                <Label htmlFor="number">Number</Label>
                <Input
                  id="number"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  placeholder="Enter your contact number..."
                  className={errors.number ? 'border-destructive' : ''}
                />
                {errors.number && (
                  <p className="text-sm text-destructive">{errors.number}</p>
                )}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button type="submit" disabled={isSaving} className="w-full gap-2">
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Profile'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
