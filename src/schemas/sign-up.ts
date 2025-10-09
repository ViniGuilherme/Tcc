import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string('Esse campo é obrigatório').min(1, 'O nome completo é obrigatório'),
  email: z.string().email('E-mail inválido'),
  password: z.string('Esse campo é obrigatório').min(6, 'A senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string('Esse campo é obrigatório').min(6, 'A confirmação de senha deve ter pelo menos 6 caracteres'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});

export type SignUpFormData = z.infer<typeof signUpSchema>;