import {Link} from "react-router-dom";
import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {BarChart3, PiggyBank, Shield, Target, TrendingUp, Wallet} from "lucide-react";

export default function Home() {
    return (
        <div className="min-h-screen bg-background">
            <header className="border-b border-border">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <PiggyBank className="h-8 w-8 text-primary"/>
                        <span className="text-xl font-bold text-foreground">Finance Flow</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link to="/auth">
                            <Button variant="ghost">Zaloguj się</Button>
                        </Link>
                        <Link to="/auth">
                            <Button>Rozpocznij</Button>
                        </Link>
                    </div>
                </div>
            </header>

            <section className="container mx-auto px-4 py-20 text-center animate-fade-in">
                <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
                    Zarządzaj swoimi finansami
                    <br/>z łatwością
                </h1>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                    Kompleksowe narzędzie do śledzenia wydatków, planowania budżetu i osiągania celów finansowych.
                    Wszystko w jednym miejscu.
                </p>
                <div className="flex gap-4 justify-center">
                    <Link to="/auth">
                        <Button size="lg" className="text-lg px-8">
                            Zacznij za darmo
                        </Button>
                    </Link>
                </div>
            </section>

            <section className="container mx-auto px-4 py-20">
                <h2 className="text-3xl font-bold text-center mb-12">Funkcje aplikacji</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card className="p-6 hover-scale">
                        <div
                            className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                            <Wallet className="h-6 w-6"/>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Śledzenie transakcji</h3>
                        <p className="text-muted-foreground">
                            Rejestruj wszystkie wydatki i przychody. Kategoryzuj transakcje i analizuj swoje nawyki
                            finansowe.
                        </p>
                    </Card>

                    <Card className="p-6 hover-scale">
                        <div
                            className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                            <BarChart3 className="h-6 w-6"/>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Zaawansowana analityka</h3>
                        <p className="text-muted-foreground">
                            Wizualizuj swoje finanse za pomocą wykresów i raportów. Identyfikuj trendy i podejmuj lepsze
                            decyzje.
                        </p>
                    </Card>

                    <Card className="p-6 hover-scale">
                        <div
                            className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                            <Target className="h-6 w-6"/>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Cele oszczędnościowe</h3>
                        <p className="text-muted-foreground">
                            Ustaw cele finansowe i śledź postępy. Planuj przyszłość i osiągaj swoje marzenia.
                        </p>
                    </Card>

                    <Card className="p-6 hover-scale">
                        <div
                            className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                            <TrendingUp className="h-6 w-6"/>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Planowanie budżetu</h3>
                        <p className="text-muted-foreground">
                            Twórz budżety dla różnych kategorii. Kontroluj wydatki i oszczędzaj więcej pieniędzy.
                        </p>
                    </Card>

                    <Card className="p-6 hover-scale">
                        <div
                            className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                            <Shield className="h-6 w-6"/>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Bezpieczeństwo danych</h3>
                        <p className="text-muted-foreground">
                            Twoje dane są szyfrowane i bezpieczne. Pełna kontrola nad prywatnością finansową.
                        </p>
                    </Card>

                    <Card className="p-6 hover-scale">
                        <div
                            className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                            <PiggyBank className="h-6 w-6"/>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Prosto i intuicyjnie</h3>
                        <p className="text-muted-foreground">
                            Przyjazny interfejs, który sprawia, że zarządzanie finansami staje się przyjemnością.
                        </p>
                    </Card>
                </div>
            </section>

            <section className="container mx-auto px-4 py-20">
                <Card
                    className="p-12 text-center bg-gradient-to-br from-primary to-primary-hover text-primary-foreground border-0">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Gotowy na lepszą kontrolę finansów?
                    </h2>
                    <p className="text-lg mb-8 text-primary-foreground/80">
                        Dołącz do użytkowników, którzy już zarządzają swoimi finansami mądrzej.
                    </p>
                    <Link to="/auth">
                        <Button size="lg" variant="secondary" className="text-lg px-8">
                            Rozpocznij teraz
                        </Button>
                    </Link>
                </Card>
            </section>

            <footer className="border-t border-border py-8">
                <div className="container mx-auto px-4 text-center text-muted-foreground">
                    <p>&copy; 2025 Finance Flow. Wszystkie prawa zastrzeżone.</p>
                </div>
            </footer>
        </div>
    );
}
