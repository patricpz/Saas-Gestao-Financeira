import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Pencil, Save, Camera, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  // Mock user data - replace with actual data from your authentication provider
  const user = {
    name: 'João Silva',
    email: 'joao@example.com',
    phone: '(11) 98765-4321',
    avatar: '/placeholder-avatar.jpg',
    joinDate: 'Junho 2023',
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center mb-6">
        <Button variant="ghost" asChild className="mr-4">
          <Link href="/dashboard">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Meu Perfil</h1>
          <p className="text-muted-foreground">Gerencie suas informações pessoais</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left Column - Profile Picture */}
        <div className="md:col-span-1 flex justify-center">
          <Card className="w-full">
            <CardContent className="flex flex-col items-center pt-6">
              <div className="relative group">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="text-3xl">
                    {user.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <label 
                  htmlFor="avatar-upload" 
                  className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-primary/90 transition-colors"
                >
                  <Camera className="h-4 w-4" />
                  <input id="avatar-upload" type="file" className="hidden" accept="image/*" />
                </label>
              </div>
              
              <h3 className="mt-4 text-lg font-medium text-center">{user.name}</h3>
              <p className="text-sm text-muted-foreground">Membro desde {user.joinDate}</p>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Profile Form */}
        <div className="md:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <div className="relative">
                      <Input id="name" defaultValue={user.name} />
                      <Pencil className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <div className="relative">
                      <Input id="email" type="email" defaultValue={user.email} disabled />
                      <Pencil className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <div className="relative">
                      <Input id="phone" defaultValue={user.phone} />
                      <Pencil className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <div className="relative">
                      <Input id="password" type="password" defaultValue="••••••••" />
                      <Pencil className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <Button type="submit" className="w-full md:w-auto">
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Alterações
                  </Button>
                </div>
              </form>

              <div className="mt-8 pt-6 border-t">
                <h3 className="text-lg font-medium mb-4">Configurações de Conta</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">Notificações por e-mail</p>
                      <p className="text-sm text-muted-foreground">Receba atualizações e notificações importantes</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">Modo Escuro</p>
                      <p className="text-sm text-muted-foreground">Ative o tema escuro para melhor visualização</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" value="" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
