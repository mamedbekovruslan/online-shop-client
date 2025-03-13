// src/components/auth/Auth.jsx
import { useState } from "react";
import { Box, Button, Stack, Text, useToast } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { login, register as registerUser } from "../../api/auth";
import {
  EmailInput,
  NameInput,
  PasswordInput,
  UsernameInput,
} from "./components/auth-form/auth-form";

const loginSchema = yup.object({
  username: yup.string().required("Логин обязателен"),
  password: yup
    .string()
    .min(6, "Пароль должен быть не менее 6 символов")
    .required("Пароль обязателен"),
});

const registerSchema = yup.object({
  name: yup.string().required("Имя обязательно"),
  username: yup.string().required("Логин обязателен"),
  email: yup.string().email("Неверный email").required("Email обязателен"),
  password: yup
    .string()
    .min(6, "Пароль должен быть не менее 6 символов")
    .required("Пароль обязателен"),
});

export const Auth = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(isRegistering ? registerSchema : loginSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      if (isRegistering) {
        const response = await registerUser(data);
        toast({
          title: "Регистрация успешна",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        const response = await login(data);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("username", response.data.username);
        localStorage.setItem("role", response.data.role);
        toast({
          title: "Авторизация успешна",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        window.location.href = "/";
      }
      reset();
    } catch (error) {
      const msg = error.response?.data?.message || "Что-то пошло не так.";
      const isConflict = error.response?.status === 409;

      toast({
        title: isConflict ? "Ошибка регистрации" : "Ошибка",
        description: isConflict
          ? "Пользователь с таким логином или email уже существует."
          : msg,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      width="sm"
      mt="17%"
      mx="auto"
      p="6"
      borderWidth="1px"
      borderRadius="lg"
      boxShadow="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={4}>
          {isRegistering && <NameInput register={register} errors={errors} />}
          {isRegistering && <EmailInput register={register} errors={errors} />}
          <UsernameInput register={register} errors={errors} />
          <PasswordInput register={register} errors={errors} />

          <Button
            type="submit"
            colorScheme="teal"
            size="md"
            width="full"
            isLoading={isLoading}
          >
            {isRegistering ? "Зарегистрироваться" : "Войти"}
          </Button>

          <Text textAlign="center">
            {isRegistering ? (
              <>
                Уже есть аккаунт?{" "}
                <Button
                  variant="link"
                  colorScheme="teal"
                  onClick={() => setIsRegistering(false)}
                >
                  Войти
                </Button>
              </>
            ) : (
              <>
                Нет аккаунта?{" "}
                <Button
                  variant="link"
                  colorScheme="teal"
                  onClick={() => setIsRegistering(true)}
                >
                  Зарегистрироваться
                </Button>
              </>
            )}
          </Text>
        </Stack>
      </form>
    </Box>
  );
};
