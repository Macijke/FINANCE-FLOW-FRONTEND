import {useState} from "react";
import {Eye, EyeOff, Lock, Mail, User} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Card} from "@/components/ui/card";
import {Separator} from "@/components/ui/separator";
import {useCookies} from "react-cookie";
import {useNavigate} from "react-router-dom";
import {getApiUrl} from "@/config/api.ts";

export default function Auth() {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [cookies, setCookie] = useCookies(['user']);

    const [loginError, setLoginError] = useState<string | null>(null);
    const [registerError, setRegisterError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        firstName: "", lastName: "", email: "", password: "", confirmPassword: "",
    });

    const clearForm = () => {
        setFormData({
            firstName: "", lastName: "", email: "", password: "", confirmPassword: "",
        });
    };

    const clearMessages = () => {
        setLoginError(null);
        setRegisterError(null);
        setSuccessMessage(null);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        clearMessages();

        const loginData = {
            email: formData.email, password: formData.password
        }

        try {
            const response = await fetch(getApiUrl(`/auth/login`), {
                method: "POST", headers: {
                    "Content-Type": "application/json",
                }, body: JSON.stringify(loginData)
            }).then(res => res.json());

            if (response.success) {
                setCookie("user", response.data.token, {
                    path: '/', expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                });
                clearForm();
                navigate("/dashboard");
            } else {
                setLoginError(response.message || "Invalid email or password");
            }
        } catch (err) {
            setLoginError("Connection error. Please try again.");
            console.error("Login error:", err);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        clearMessages();

        const registerData = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
        }

        try {
            const response = await fetch(getApiUrl(`/auth/register`), {
                method: "POST", headers: {
                    "Content-Type": "application/json",
                }, body: JSON.stringify(registerData)
            }).then(res => res.json());

            if (response.success) {
                setSuccessMessage("Account created successfully! Please log in.");
                clearForm();
                setIsLogin(true);
            } else {
                setRegisterError(response.message || "Registration failed");
            }
        } catch (err) {
            setRegisterError("Connection error. Please try again.");
            console.error("Register error:", err);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({...formData, [e.target.name]: e.target.value});
        clearMessages();
    };

    const switchToRegister = () => {
        setIsLogin(false);
        clearForm();
        clearMessages();
    };

    const switchToLogin = () => {
        setIsLogin(true);
        clearForm();
        clearMessages();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isLogin) {
            handleLogin(e);
        } else {
            handleRegister(e);
        }
    };

    return (<div
            className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
            <div className="w-full max-w-md animate-fade-in">
                <Card className="p-8 shadow-elevated border-border/50">
                    <div className="text-center mb-8">
                        <div
                            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 mb-4 shadow-glow">
                            <span className="text-2xl font-bold text-primary-foreground">$</span>
                        </div>
                        <h1 className="text-2xl font-bold mb-2">
                            {isLogin ? "Welcome Back" : "Create Account"}
                        </h1>
                        <p className="text-muted-foreground">
                            {isLogin ? "Sign in to manage your finances" : "Start tracking your expenses today"}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {loginError && (<div
                                className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm flex items-start gap-2">
                                <span className="text-lg">⚠️</span>
                                <span>{loginError}</span>
                            </div>)}

                        {registerError && (<div
                                className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm flex items-start gap-2">
                                <span className="text-lg">⚠️</span>
                                <span>{registerError}</span>
                            </div>)}

                        {successMessage && (<div
                                className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
                                <span className="text-lg">✅</span>
                                <span>{successMessage}</span>
                            </div>)}

                        {!isLogin && (<>
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <div className="relative">
                                        <User
                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                                        <Input
                                            id="firstName"
                                            name="firstName"
                                            type="text"
                                            placeholder="Jan"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            className="pl-10"
                                            required={!isLogin}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <div className="relative">
                                        <User
                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                                        <Input
                                            id="lastName"
                                            name="lastName"
                                            type="text"
                                            placeholder="Nowak"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            className="pl-10"
                                            required={!isLogin}
                                        />
                                    </div>
                                </div>
                            </>)}

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="pl-10"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Lock
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="pl-10 pr-10"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-smooth"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                                </button>
                            </div>
                        </div>

                        {!isLogin && (<div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <div className="relative">
                                    <Lock
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="pl-10"
                                        required={!isLogin}
                                    />
                                </div>
                            </div>)}

                        {isLogin && (<div className="flex justify-end">
                                <button
                                    type="button"
                                    className="text-sm text-primary hover:text-primary/80 transition-smooth"
                                >
                                    Forgot password?
                                </button>
                            </div>)}

                        <Button type="submit" className="w-full" size="lg">
                            {isLogin ? "Sign In" : "Create Account"}
                        </Button>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <Separator/>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-card px-2 text-muted-foreground">
                                    Or continue with
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <Button variant="outline" type="button">
                                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                                    <path fill="currentColor"
                                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="currentColor"
                                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="currentColor"
                                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                    <path fill="currentColor"
                                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                </svg>
                                Google
                            </Button>
                            <Button variant="outline" type="button">
                                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                    <path
                                        d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                                </svg>
                                GitHub
                            </Button>
                        </div>
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-muted-foreground">
                            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                            <button
                                type="button"
                                onClick={() => isLogin ? switchToRegister() : switchToLogin()}
                                className="text-primary hover:text-primary/80 font-medium transition-smooth"
                            >
                                {isLogin ? "Sign up" : "Sign in"}
                            </button>
                        </p>
                    </div>
                </Card>

                <p className="mt-6 text-center text-xs text-muted-foreground">
                    By continuing, you agree to our{" "}
                    <button className="text-primary hover:text-primary/80 transition-smooth">
                        Terms of Service
                    </button>
                    {" "}and{" "}
                    <button className="text-primary hover:text-primary/80 transition-smooth">
                        Privacy Policy
                    </button>
                </p>
            </div>
        </div>);
}
