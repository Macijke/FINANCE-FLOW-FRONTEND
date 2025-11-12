import {Bell, Menu, Moon, Sun, Settings, LogOut} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {useTheme} from "@/hooks/use-theme";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {useCookies} from "react-cookie";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";

interface HeaderProps {
    onMenuClick?: () => void;
}

export function Header({onMenuClick}: HeaderProps) {
    const {theme, setTheme} = useTheme();
    const [cookies, setCookie, removeCookie] = useCookies(['user']);
    const navigate = useNavigate();
    const [userProfile, setUserProfile] = useState(null);

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
            } catch (err) {
                console.error('Error fetching profile:', err);
            }
        };

        if (cookies.user) {
            fetchProfile();
        }
    }, [cookies.user]);

    const handleLogout = () => {
        removeCookie('user', { path: '/' });
        navigate('/');
    };

    const handleSettings = () => {
        navigate('/settings');
    };

    const getInitials = () => {
        if (!userProfile) return 'U';
        const firstInitial = userProfile.firstName?.[0] || '';
        const lastInitial = userProfile.lastName?.[0] || '';
        return (firstInitial + lastInitial).toUpperCase();
    };

    return (
        <header className="sticky top-0 z-40 bg-background border-b border-border">
            <div className="flex items-center justify-between h-16 px-4 lg:px-6">
                <div className="flex items-center flex-1">
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                    >
                        {theme === "dark" ? (
                            <Sun className="h-5 w-5"/>
                        ) : (
                            <Moon className="h-5 w-5"/>
                        )}
                    </Button>

                    <Button variant="ghost" size="icon" title="Notifications">
                        <Bell className="h-5 w-5"/>
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="relative h-10 w-10 rounded-full"
                            >
                                <Avatar className="h-10 w-10">
                                    {userProfile?.profilePictureUrl && (
                                        <AvatarImage
                                            src={userProfile.profilePictureUrl}
                                            alt={`${userProfile.firstName} ${userProfile.lastName}`}
                                        />
                                    )}
                                    <AvatarFallback className="bg-primary text-primary-foreground">
                                        {getInitials()}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 bg-popover">
                            <DropdownMenuLabel>
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">
                                        {userProfile?.firstName} {userProfile?.lastName}
                                    </p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                        {userProfile?.email}
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleSettings} className="cursor-pointer">
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Settings</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={handleLogout}
                                className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Log out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}
