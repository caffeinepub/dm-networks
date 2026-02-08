import { useState, useMemo } from 'react';
import AuthGate from '../../components/auth/AuthGate';
import { useMemberDirectory, useIsCallerAdmin, useToggleVerifiedBadge } from '../../hooks/useQueries';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Search, Users, Link as LinkIcon, AlertCircle, Lock, Briefcase, Target, Lightbulb, Phone, MapPin, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { ProfileVisibility } from '../../backend';
import VerifiedBadge from '../../components/user/VerifiedBadge';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';

export default function MembersPage() {
  return (
    <AuthGate>
      <Toaster />
      <MembersContent />
    </AuthGate>
  );
}

function MembersContent() {
  const { data: members, isLoading, error } = useMemberDirectory();
  const { data: isAdmin } = useIsCallerAdmin();
  const [nameSearch, setNameSearch] = useState('');
  const [bioSearch, setBioSearch] = useState('');
  const [hasSocialLinksFilter, setHasSocialLinksFilter] = useState(false);

  const filteredMembers = useMemo(() => {
    if (!members) return [];

    return members.filter((member) => {
      const profile = member.profile;

      // Display name filter
      if (nameSearch.trim()) {
        const nameMatch = profile.displayName
          .toLowerCase()
          .includes(nameSearch.toLowerCase().trim());
        if (!nameMatch) return false;
      }

      // Bio keyword filter - only search if bio exists and is not empty
      if (bioSearch.trim()) {
        const bioMatch = profile.bio
          ? profile.bio.toLowerCase().includes(bioSearch.toLowerCase().trim())
          : false;
        if (!bioMatch) return false;
      }

      // Social links filter - guard against undefined
      if (hasSocialLinksFilter) {
        const hasSocialLinks = profile.socialLinks && profile.socialLinks.length > 0;
        if (!hasSocialLinks) return false;
      }

      return true;
    });
  }, [members, nameSearch, bioSearch, hasSocialLinksFilter]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-3">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="text-sm text-muted-foreground">Loading members...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load member directory. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const hasMembers = members && members.length > 0;
  const hasFilteredResults = filteredMembers.length > 0;
  const hasActiveFilters = nameSearch.trim() || bioSearch.trim() || hasSocialLinksFilter;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Users className="h-8 w-8 text-primary" />
          Members Directory
        </h1>
        <p className="text-muted-foreground">
          Discover and connect with other members of the network
        </p>
      </div>

      {/* Filters */}
      {hasMembers && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filter Members</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name-search">Search by Name</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name-search"
                    type="text"
                    placeholder="Enter display name..."
                    value={nameSearch}
                    onChange={(e) => setNameSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio-search">Search by Bio</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="bio-search"
                    type="text"
                    placeholder="Enter keyword..."
                    value={bioSearch}
                    onChange={(e) => setBioSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="social-links-filter"
                checked={hasSocialLinksFilter}
                onCheckedChange={setHasSocialLinksFilter}
              />
              <Label htmlFor="social-links-filter" className="cursor-pointer">
                Only show members with social links
              </Label>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {!hasMembers ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No members found in the directory yet.</p>
          </CardContent>
        </Card>
      ) : !hasFilteredResults ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {hasActiveFilters
                ? 'No members match your search criteria. Try adjusting your filters.'
                : 'No members found.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Showing {filteredMembers.length} {filteredMembers.length === 1 ? 'member' : 'members'}
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            {filteredMembers.map((member) => (
              <MemberCard key={member.principal.toString()} member={member} isAdmin={isAdmin || false} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MemberCard({ member, isAdmin }: { member: any; isAdmin: boolean }) {
  const profile = member.profile;
  const isPrivate = profile.visibility === ProfileVisibility.privateVisibility;
  const toggleVerified = useToggleVerifiedBadge();
  const [isToggling, setIsToggling] = useState(false);

  const hasBusinessInfo =
    !isPrivate &&
    (profile.skills ||
      profile.programmingLanguages ||
      profile.currentProjects ||
      profile.activityInterests ||
      profile.number);

  const handleToggleVerified = async () => {
    setIsToggling(true);
    try {
      await toggleVerified.mutateAsync(member.principal);
      toast.success(
        member.isVerified
          ? 'Verified badge removed successfully'
          : 'Verified badge assigned successfully'
      );
    } catch (error: any) {
      console.error('Failed to toggle verified badge:', error);
      toast.error(error.message || 'Failed to update verified status. Please try again.');
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <CardTitle className="text-xl truncate">{profile.displayName}</CardTitle>
              {member.isVerified && <VerifiedBadge />}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {isPrivate && (
                <Badge variant="secondary" className="gap-1">
                  <Lock className="h-3 w-3" />
                  Private
                </Badge>
              )}
            </div>
          </div>
        </div>
        {isAdmin && (
          <div className="pt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleVerified}
              disabled={isToggling}
              className="w-full"
            >
              {isToggling ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : member.isVerified ? (
                'Remove Verified Badge'
              ) : (
                'Assign Verified Badge'
              )}
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Bio */}
        {profile.bio && (
          <p className="text-sm text-muted-foreground line-clamp-3">{profile.bio}</p>
        )}

        {/* Social Links */}
        {profile.socialLinks && profile.socialLinks.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <LinkIcon className="h-4 w-4" />
              Social Links
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline truncate max-w-full"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Business Information - Only for public profiles with data */}
        {hasBusinessInfo && (
          <>
            <Separator />
            <div className="space-y-3">
              {profile.skills && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Briefcase className="h-4 w-4" />
                    Business name
                  </div>
                  <p className="text-sm text-muted-foreground pl-6">{profile.skills}</p>
                </div>
              )}

              {profile.programmingLanguages && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Lightbulb className="h-4 w-4" />
                    Slogan
                  </div>
                  <p className="text-sm text-muted-foreground pl-6">
                    {profile.programmingLanguages}
                  </p>
                </div>
              )}

              {profile.currentProjects && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Target className="h-4 w-4" />
                    Business Description
                  </div>
                  <p className="text-sm text-muted-foreground pl-6 line-clamp-3">
                    {profile.currentProjects}
                  </p>
                </div>
              )}

              {profile.activityInterests && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <MapPin className="h-4 w-4" />
                    Location
                  </div>
                  <p className="text-sm text-muted-foreground pl-6 line-clamp-2">
                    {profile.activityInterests}
                  </p>
                </div>
              )}

              {profile.number && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Phone className="h-4 w-4" />
                    Number
                  </div>
                  <p className="text-sm text-muted-foreground pl-6">{profile.number}</p>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
