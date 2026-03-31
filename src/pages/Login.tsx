import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { CheckCircle2, Mail, Lock, Eye, EyeOff, Loader2, LogIn, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Mode = 'signin' | 'signup';

const Login: React.FC = () => {
    const [mode, setMode] = useState<Mode>('signin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error('Please fill in all fields.');
            return;
        }
        setLoading(true);
        try {
            if (mode === 'signin') {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                toast.success('Welcome back!');
            } else {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
                toast.success('Account created! Check your email to confirm, then sign in.');
                setMode('signin');
            }
        } catch (err: any) {
            toast.error(err.message || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            {/* Ambient background blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
            </div>

            <div className="relative w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary shadow-lg shadow-primary/30 mb-4">
                        <CheckCircle2 className="h-9 w-9 text-primary-foreground" />
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight">Todify</h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        {mode === 'signin' ? 'Sign in to sync your tasks across all devices' : 'Create an account to get started'}
                    </p>
                </div>

                {/* Card */}
                <div className="bg-card border border-border rounded-2xl shadow-xl p-8 space-y-6">
                    {/* Tabs */}
                    <div className="flex rounded-xl bg-muted p-1 gap-1">
                        <button
                            onClick={() => setMode('signin')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${mode === 'signin'
                                    ? 'bg-background text-foreground shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <LogIn className="h-4 w-4" />
                            Sign In
                        </button>
                        <button
                            onClick={() => setMode('signup')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${mode === 'signup'
                                    ? 'bg-background text-foreground shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <UserPlus className="h-4 w-4" />
                            Sign Up
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="email">Email address</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@email.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="pl-9"
                                    autoComplete="email"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder={mode === 'signup' ? 'At least 6 characters' : '••••••••'}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="pl-9 pr-10"
                                    autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(v => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-11 text-sm font-semibold shadow-md shadow-primary/20 active:scale-95 transition-all"
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : mode === 'signin' ? (
                                <LogIn className="h-4 w-4 mr-2" />
                            ) : (
                                <UserPlus className="h-4 w-4 mr-2" />
                            )}
                            {loading ? 'Please wait…' : mode === 'signin' ? 'Sign In' : 'Create Account'}
                        </Button>
                    </form>

                    {/* Footer hint */}
                    <p className="text-center text-xs text-muted-foreground">
                        {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
                        <button
                            onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                            className="text-primary font-semibold hover:underline"
                        >
                            {mode === 'signin' ? 'Sign up' : 'Sign in'}
                        </button>
                    </p>
                </div>

                <p className="text-center text-xs text-muted-foreground mt-6">
                    Your tasks are synced securely across all your devices.
                </p>
            </div>
        </div>
    );
};

export default Login;
