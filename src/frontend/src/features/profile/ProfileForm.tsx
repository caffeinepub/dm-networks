import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { validateProfile, type ProfileValidationErrors } from './validateProfile';
import { Plus, X, Loader2 } from 'lucide-react';
import type { UserProfile } from '../../backend';

interface ProfileFormProps {
  initialProfile?: UserProfile | null;
  onSave: (profile: UserProfile) => Promise<void>;
  isSaving: boolean;
}

export default function ProfileForm({ initialProfile, onSave, isSaving }: ProfileFormProps) {
  const [displayName, setDisplayName] = useState(initialProfile?.displayName || '');
  const [bio, setBio] = useState(initialProfile?.bio || '');
  const [socialLinks, setSocialLinks] = useState<string[]>(
    initialProfile?.socialLinks.length ? initialProfile.socialLinks : ['']
  );
  const [errors, setErrors] = useState<ProfileValidationErrors>({});

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
    const validationErrors = validateProfile(displayName, bio, filteredLinks);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const profile: UserProfile = {
      displayName: displayName.trim(),
      bio: bio.trim(),
      socialLinks: filteredLinks,
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

