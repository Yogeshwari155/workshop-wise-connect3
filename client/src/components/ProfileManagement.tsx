
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';
import { User, Mail, Phone, Camera, Edit, Lock, Download, Trash2 } from 'lucide-react';

const ProfileManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(false);

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    bio: '',
    profilePicture: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleProfileSave = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Profile Updated! ✅",
        description: "Your profile has been successfully updated.",
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords don't match",
        description: "Please ensure both passwords are identical.",
      });
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Password Changed! 🔒",
        description: "Your password has been successfully updated.",
      });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setIsChangingPassword(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Password Change Failed",
        description: "Please check your current password and try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadData = async () => {
    setLoading(true);
    try {
      // Simulate data preparation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock download
      const data = {
        user: profileData,
        workshops: [
          { title: "React Workshop", date: "2025-01-15", status: "confirmed" },
          { title: "Data Science", date: "2025-01-25", status: "completed" }
        ]
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${user?.name || 'user'}-data.json`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast({
        title: "Data Downloaded! 📥",
        description: "Your workshop data has been downloaded successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Download Failed",
        description: "Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Account Deletion Requested",
        description: "Your account deletion request has been submitted. You will receive an email confirmation.",
      });
      setIsDeleting(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Deletion Failed",
        description: "Please contact support for assistance.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Information Card */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Profile Information</span>
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            <Edit className="h-4 w-4 mr-2" />
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Picture */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {user?.name?.charAt(0) || 'U'}
              </div>
              {isEditing && (
                <button className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg border-2 border-gray-200 hover:bg-gray-50">
                  <Camera className="h-4 w-4 text-gray-600" />
                </button>
              )}
            </div>
            {isEditing && (
              <div className="text-sm text-gray-600">
                <p>Click the camera icon to upload a new profile picture</p>
                <p className="text-xs">Supported formats: JPG, PNG (max 5MB)</p>
              </div>
            )}
          </div>

          {/* Profile Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-600">Full Name</Label>
              {isEditing ? (
                <Input
                  value={profileData.name}
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  placeholder="Enter your full name"
                />
              ) : (
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900">{profileData.name}</span>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-600">Email Address</Label>
              {isEditing ? (
                <Input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  placeholder="Enter your email"
                />
              ) : (
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900">{profileData.email}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-600">Phone Number</Label>
              {isEditing ? (
                <Input
                  value={profileData.phone}
                  onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  placeholder="Enter your phone number"
                />
              ) : (
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900">{profileData.phone || 'Not provided'}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-600">Account Type</Label>
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 capitalize">
                  {user?.role}
                </span>
              </div>
            </div>
          </div>

          {/* Bio Section */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-600">Bio</Label>
            {isEditing ? (
              <Textarea
                value={profileData.bio}
                onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                placeholder="Tell us about yourself..."
                rows={4}
              />
            ) : (
              <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
                {profileData.bio || 'No bio provided yet.'}
              </p>
            )}
          </div>

          {/* Save Button for Edit Mode */}
          {isEditing && (
            <div className="pt-4 border-t">
              <Button 
                onClick={handleProfileSave}
                disabled={loading}
                className="bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Account Actions Card */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Account Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Change Password */}
            <Dialog open={isChangingPassword} onOpenChange={setIsChangingPassword}>
              <DialogTrigger asChild>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                  <Lock className="h-6 w-6 text-blue-600" />
                  <span className="font-medium">Change Password</span>
                  <span className="text-xs text-gray-500 text-center">Update your account security</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Change Password</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Current Password</Label>
                    <Input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                      placeholder="Enter current password"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>New Password</Label>
                    <Input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                      placeholder="Enter new password"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Confirm New Password</Label>
                    <Input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                      placeholder="Confirm new password"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      onClick={handlePasswordChange}
                      disabled={loading}
                      className="flex-1"
                    >
                      {loading ? 'Changing...' : 'Change Password'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsChangingPassword(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Download Data */}
            <Button 
              variant="outline" 
              onClick={handleDownloadData}
              disabled={loading}
              className="h-auto p-4 flex flex-col items-center space-y-2"
            >
              <Download className="h-6 w-6 text-green-600" />
              <span className="font-medium">Download My Data</span>
              <span className="text-xs text-gray-500 text-center">Export your workshop data</span>
            </Button>

            {/* Delete Account */}
            <Dialog open={isDeleting} onOpenChange={setIsDeleting}>
              <DialogTrigger asChild>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2 border-red-200 hover:border-red-300 hover:bg-red-50">
                  <Trash2 className="h-6 w-6 text-red-600" />
                  <span className="font-medium">Delete Account</span>
                  <span className="text-xs text-gray-500 text-center">Permanently remove account</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-red-600">Delete Account</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800 font-medium mb-2">⚠️ This action cannot be undone!</p>
                    <p className="text-red-700 text-sm">
                      Deleting your account will permanently remove:
                    </p>
                    <ul className="list-disc list-inside text-red-700 text-sm mt-2 space-y-1">
                      <li>Your profile information</li>
                      <li>All workshop registrations</li>
                      <li>Your learning history</li>
                      <li>Any saved preferences</li>
                    </ul>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="destructive"
                      onClick={handleDeleteAccount}
                      disabled={loading}
                      className="flex-1"
                    >
                      {loading ? 'Processing...' : 'Yes, Delete My Account'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsDeleting(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileManagement;
