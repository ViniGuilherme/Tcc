import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input"
import { sessionAtom } from "@/lib/atoms/session";
import { makeSignUp } from "@/lib/services/auth/make-sign-up";
import { signUpSchema } from "@/schemas/sign-up";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";

export default function SignUpPage() {
  let navigate = useNavigate();
  const setSession = useSetAtom(sessionAtom);

  const form = useForm({
    resolver: zodResolver(signUpSchema),
  });
  const { mutate, isPending } = useMutation({
    mutationFn: makeSignUp,
    onSuccess: (data) => {
      setSession(data);
      toast.success("Cadastro realizado com sucesso! Bem-vindo!");
      navigate("/");
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao criar conta. Tente novamente.");
    },
  });

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 bg-primary flex flex-col justify-center px-12 text-primary-foreground relative overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary/50 rounded-full opacity-30"></div>
        <div className="absolute bottom-32 right-16 w-24 h-24 bg-primary rounded-full opacity-40"></div>
        <div className="absolute top-1/2 left-8 w-16 h-16 bg-primary/25 rounded-full opacity-25"></div>

        <div className="max-w-md relative z-10">
          <h1 className="text-3xl font-bold mb-8">PetGrooming</h1>
          <div className="space-y-4">
            <p className="text-lg leading-relaxed">
              Crie sua conta e encontre os melhores cuidados para o seu melhor amigo. Rápido, fácil e seguro.
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-gray-50 flex items-center justify-center px-12">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-gray-900">Crie sua Conta</h2>
            <p className="text-gray-600">Vamos começar!</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => mutate(data))} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Seu nome completo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="seu@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Mínimo 8 caracteres"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar Senha</FormLabel>
                    <FormControl>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Repita sua senha"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isPending}
                className="w-full h-12 bg-primary hover:bg-primary/80 font-semibold text-lg"
              >
                {isPending ? "Carregando..." : "Cadastrar"}
              </Button>
            </form>
          </Form>

          <div className="text-center">
            <p className="text-gray-600">
              Já tem uma conta?{" "}
              <Link to="/entrar" className="text-primary hover:opacity-70 font-medium">
                Faça login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

