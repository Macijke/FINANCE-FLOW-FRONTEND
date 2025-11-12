import {Card} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Camera, Info, Lock} from "lucide-react";
import {useState, useEffect} from "react";
import {useCookies} from "react-cookie";

export default function Settings() {
    const [cookies] = useCookies(['user']);
    const [loading, setLoading] = useState({
        profile: false,
        password: false,
    });
    const [userProfile, setUserProfile] = useState(null);
    const [profilePictureUrl, setProfilePictureUrl] = useState('');
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [messages, setMessages] = useState({
        profile: { success: false, error: null },
        password: { success: false, error: null },
    });

    // Fetch user profile
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/v1/users/profile', {
                    headers: {
                        'Authorization': `Bearer ${cookies.user}`,
                    },
                });
                const data = await response.json();
                setUserProfile(data.data);
                setProfilePictureUrl(data.data.profilePictureUrl || '');
            } catch (err) {
                console.error('Error fetching profile:', err);
            }
        };

        if (cookies.user) {
            fetchProfile();
        }
    }, [cookies.user]);

    // Update profile picture
    const handleProfilePictureUpdate = async (e) => {
        e.preventDefault();
        setMessages(prev => ({ ...prev, profile: { success: false, error: null } }));

        if (profilePictureUrl && !profilePictureUrl.match(/^https?:\/\/.+/)) {
            setMessages(prev => ({
                ...prev,
                profile: { success: false, error: "Please enter a valid URL (starting with http:// or https://)" }
            }));
            return;
        }

        try {
            setLoading(prev => ({ ...prev, profile: true }));

            const response = await fetch('http://localhost:8080/api/v1/users/profile-picture', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${cookies.user}`,
                },
                body: JSON.stringify({
                    profilePictureUrl: profilePictureUrl || null,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to update profile picture');
            }

            const data = await response.json();
            setUserProfile(data.data);
            setMessages(prev => ({
                ...prev,
                profile: { success: true, error: null }
            }));

            setTimeout(() => {
                setMessages(prev => ({ ...prev, profile: { success: false, error: null } }));
            }, 3000);
        } catch (err) {
            setMessages(prev => ({
                ...prev,
                profile: { success: false, error: err.message }
            }));
        } finally {
            setLoading(prev => ({ ...prev, profile: false }));
        }
    };

    const handleRemoveProfilePicture = async () => {
        setProfilePictureUrl('');
        setTimeout(() => {
            document.getElementById('profile-picture-form')?.requestSubmit();
        }, 100);
    };

    // Change password
    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setMessages(prev => ({ ...prev, password: { success: false, error: null } }));

        if (passwords.newPassword !== passwords.confirmPassword) {
            setMessages(prev => ({
                ...prev,
                password: { success: false, error: "New passwords don't match" }
            }));
            return;
        }

        if (passwords.newPassword.length < 8) {
            setMessages(prev => ({
                ...prev,
                password: { success: false, error: "Password must be at least 8 characters" }
            }));
            return;
        }

        try {
            setLoading(prev => ({ ...prev, password: true }));

            const response = await fetch('http://localhost:8080/api/v1/auth/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${cookies.user}`,
                },
                body: JSON.stringify({
                    currentPassword: passwords.currentPassword,
                    newPassword: passwords.newPassword,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to change password');
            }

            setMessages(prev => ({
                ...prev,
                password: { success: true, error: null }
            }));

            setPasswords({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });

            setTimeout(() => {
                setMessages(prev => ({ ...prev, password: { success: false, error: null } }));
            }, 3000);
        } catch (err) {
            setMessages(prev => ({
                ...prev,
                password: { success: false, error: err.message }
            }));
        } finally {
            setLoading(prev => ({ ...prev, password: false }));
        }
    };

    return (
        <div className="space-y-6 animate-fade-in max-w-2xl px-4 sm:px-0">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Settings</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Manage your account settings and preferences
                </p>
            </div>

            {/* Profile Picture */}
            <Card className="p-6">
                <div className="flex items-center gap-2 mb-6">
                    <Camera className="h-5 w-5" />
                    <h2 className="text-xl font-semibold">Profile Picture</h2>
                </div>

                <div className="flex flex-col sm:flex-row gap-6 items-start">
                    {/* Avatar Preview */}
                    <div className="flex flex-col items-center gap-3">
                        <div className="relative group">
                            {profilePictureUrl ? (
                                <img
                                    src={profilePictureUrl}
                                    alt="Profile"
                                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-gray-200 transition-all group-hover:border-blue-400"
                                    onError={(e) => {
                                        e.target.src = `https://ui-avatars.com/api/?name=${userProfile?.firstName}+${userProfile?.lastName}&size=128&background=random`;
                                    }}
                                />
                            ) : (
                                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-3xl sm:text-4xl font-bold border-4 border-gray-200 transition-all group-hover:border-blue-400">
                                    {userProfile?.firstName?.[0]}{userProfile?.lastName?.[0]}
                                </div>
                            )}
                            <div className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg border-2 border-gray-200 group-hover:border-blue-400 transition-all">
                                <Camera className="h-4 w-4 text-gray-600" />
                            </div>
                        </div>
                        {profilePictureUrl && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleRemoveProfilePicture}
                                className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                                Remove Picture
                            </Button>
                        )}
                    </div>

                    {/* Form */}
                    <form
                        id="profile-picture-form"
                        onSubmit={handleProfilePictureUpdate}
                        className="flex-1 space-y-4 w-full"
                    >
                        <div className="space-y-2">
                            <Label htmlFor="picture-url">Profile Picture URL</Label>
                            <Input
                                id="picture-url"
                                type="url"
                                placeholder="https://example.com/your-photo.jpg"
                                value={profilePictureUrl}
                                onChange={(e) => setProfilePictureUrl(e.target.value)}
                                disabled={loading.profile}
                            />
                            <p className="text-xs text-muted-foreground">
                                Enter a URL to your profile picture
                            </p>
                        </div>

                        {messages.profile.error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-600">{messages.profile.error}</p>
                            </div>
                        )}

                        {messages.profile.success && (
                            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                                <p className="text-sm text-green-600">✓ Profile picture updated successfully!</p>
                            </div>
                        )}

                        <Button type="submit" disabled={loading.profile}>
                            {loading.profile ? 'Updating...' : 'Update Picture'}
                        </Button>
                    </form>
                </div>

                {/* Info box */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-3">
                        <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-blue-800">
                            <p className="font-medium mb-1">Recommended image sources:</p>
                            <ul className="list-disc list-inside space-y-1 text-xs">
                                <li><a href="https://imgur.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-900">Imgur</a> - Free image hosting</li>
                                <li><a href="https://cloudinary.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-900">Cloudinary</a> - Image management</li>
                                <li><a href="https://gravatar.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-900">Gravatar</a> - Universal avatar</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Change Password */}
            <Card className="p-6">
                <div className="flex items-center gap-2 mb-6">
                    <Lock className="h-5 w-5" />
                    <h2 className="text-xl font-semibold">Change Password</h2>
                </div>

                <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="current">Current Password</Label>
                        <Input
                            id="current"
                            type="password"
                            placeholder="Enter your current password"
                            value={passwords.currentPassword}
                            onChange={(e) => setPasswords({...passwords, currentPassword: e.target.value})}
                            required
                            disabled={loading.password}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="new">New Password</Label>
                        <Input
                            id="new"
                            type="password"
                            placeholder="Enter your new password"
                            value={passwords.newPassword}
                            onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                            required
                            minLength={8}
                            disabled={loading.password}
                        />
                        <p className="text-xs text-muted-foreground">
                            Must be at least 8 characters long
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirm">Confirm New Password</Label>
                        <Input
                            id="confirm"
                            type="password"
                            placeholder="Confirm your new password"
                            value={passwords.confirmPassword}
                            onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                            required
                            disabled={loading.password}
                        />
                    </div>

                    {messages.password.error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600">{messages.password.error}</p>
                        </div>
                    )}

                    {messages.password.success && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-sm text-green-600">✓ Password changed successfully!</p>
                        </div>
                    )}

                    <Button type="submit" disabled={loading.password} className="w-full sm:w-auto">
                        {loading.password ? 'Changing...' : 'Change Password'}
                    </Button>
                </form>
            </Card>

            {/* Account Info */}
            <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Account Information</h2>
                <div className="space-y-3">
                    <div className="flex justify-between items-center py-3 border-b">
                        <span className="text-sm text-muted-foreground">Full Name</span>
                        <span className="text-sm font-medium">
                            {userProfile?.firstName} {userProfile?.lastName}
                        </span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b">
                        <span className="text-sm text-muted-foreground">Email Address</span>
                        <span className="text-sm font-medium">{userProfile?.email}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b">
                        <span className="text-sm text-muted-foreground">Default Currency</span>
                        <span className="text-sm font-medium">{userProfile?.defaultCurrency || 'USD'}</span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                        <span className="text-sm text-muted-foreground">Account Role</span>
                        <span className="text-sm font-medium capitalize">{userProfile?.role?.toLowerCase()}</span>
                    </div>
                </div>
            </Card>

            {/* Coming Soon */}
            <Card className="p-6 border-dashed border-2 opacity-60">
                <h2 className="text-xl font-semibold mb-4">Additional Settings</h2>
                <p className="text-sm text-muted-foreground mb-3">
                    The following features are currently in development:
                </p>
                <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                    <li>Email notifications preferences</li>
                    <li>Two-factor authentication</li>
                    <li>Currency and language preferences</li>
                    <li>Data export (CSV/PDF)</li>
                    <li>Account deletion</li>
                </ul>
            </Card>
        </div>
    );
}
