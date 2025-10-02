import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { sessionAtom } from "@/lib/atoms/session";
import { makeSignIn } from "@/lib/services/auth/make-sign-in";
import { signInSchema } from "@/schemas/sign-in";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";

export function SignInPage() {
  const setSession = useSetAtom(sessionAtom);
  let navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(signInSchema),
  });
  const { mutate, isPending } = useMutation({
    mutationFn: makeSignIn,
    onSuccess: (data) => {
      navigate("/");
      setSession(data);
    },
  })

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 bg-primary md:flex flex-col justify-center px-12 text-white hidden">
        <div className="max-w-md h-full flex flex-col justify-between py-6">
          <h1 className="text-3xl font-bold mb-8">PetGrooming</h1>
          <div className="space-y-4">
            <h2 className="text-4xl font-bold leading-tight">Bem-vindo de volta!</h2>
            <p className="text-lg opacity-90">Acesse sua conta para agendar os melhores cuidados para o seu pet.</p>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-gray-50 flex items-center justify-center px-12">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-gray-900">Entrar</h2>
            <p className="text-gray-600">Por favor, insira seus dados para continuar.</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => mutate(data))} className="space-y-4">
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="text-right">
                <Link to="#" className="text-primary font-medium text-sm cursor-pointer">
                  Esqueci minha senha
                </Link>
              </div>

              <Button
                type="submit"
                disabled={isPending}
                className="w-full h-12 bg-primary font-semibold text-lg cursor-pointer"
              >
                {isPending ? "Carregando..." : "Entrar"}
              </Button>
            </form>
          </Form>

          <div className="text-center">
            <p className="text-gray-600">
              Não tem uma conta?{" "}
              <Link to={'/cadastrar'} className="text-primary hover:opacity-70 font-medium cursor-pointer">
                Cadastre-se aqui
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
