import { useEffect } from 'react';
import AuthGate from '../../components/auth/AuthGate';
import ProfileForm from './ProfileForm';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from '../../hooks/useQueries';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import type { SerializableUserProfile } from '../../backend';

export default function ProfilePage() {
  const { data: userProfile, isLoading, isFetched } = useGetCallerUserProfile();
  const saveMutation = useSaveCallerUserProfile();

  const handleSave = async (profile: SerializableUserProfile) => {
    try {
      await saveMutation.mutateAsync(profile);
      toast.success('Profile saved successfully!');
    } catch (error: any) {
      console.error('Failed to save profile:', error);
      toast.error(error.message || 'Failed to save profile. Please try again.');
    }
  };

  return (
    <AuthGate>
      <Toaster />
      <div className="py-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-3">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
              <p className="text-sm text-muted-foreground">Loading profile...</p>
            </div>
          </div>
        ) : (
          <ProfileForm
            initialProfile={userProfile}
            onSave={handleSave}
            isSaving={saveMutation.isPending}
          />
        )}
      </div>
    </AuthGate>
  );
}
