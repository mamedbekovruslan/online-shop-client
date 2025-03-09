import { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { login, register as registerUser } from "../../api/auth";

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
        console.log("Submitting data:", data);
        console.log("Registering user...");

        const response = await registerUser(data);
        console.log("Response:", response);

        toast({
          title: "Регистрация успешна",
          description:
            response.data.message || "Вы успешно зарегистрировались.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        console.log("Logging in...");
        const response = await login(data);
        console.log("Response:", response);

        localStorage.setItem("token", response.data.token);
        localStorage.setItem("username", response.data.username);
        localStorage.setItem("role", response.data.role); // Добавляем роль пользователя

        toast({
          title: "Авторизация успешна",
          description: response.data.message || "Вы успешно авторизовались.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        window.location.href = "/"; // Перезагружаем страницу
      }
      reset();
    } catch (error) {
      console.error("Ошибка запроса:", error); // Выведем в консоль ошибку
      toast({
        title: "Ошибка",
        description: error.response?.data?.message || "Что-то пошло не так.",
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
          {isRegistering && (
            <FormControl isInvalid={errors.name}>
              <FormLabel>Имя</FormLabel>
              <Input {...register("name")} placeholder="Введите ваше имя" />
              <Text color="red.500" fontSize="sm">
                {errors.name?.message}
              </Text>
            </FormControl>
          )}

          {isRegistering && (
            <FormControl isInvalid={errors.email}>
              <FormLabel>Email</FormLabel>
              <Input {...register("email")} placeholder="Введите ваш email" />
              <Text color="red.500" fontSize="sm">
                {errors.email?.message}
              </Text>
            </FormControl>
          )}

          <FormControl isInvalid={errors.username}>
            <FormLabel>Логин</FormLabel>
            <Input {...register("username")} placeholder="Введите ваш логин" />
            <Text color="red.500" fontSize="sm">
              {errors.username?.message}
            </Text>
          </FormControl>

          <FormControl isInvalid={errors.password}>
            <FormLabel>Пароль</FormLabel>
            <Input
              type="password"
              {...register("password")}
              placeholder="Введите ваш пароль"
            />
            <Text color="red.500" fontSize="sm">
              {errors.password?.message}
            </Text>
          </FormControl>

          <Button
            type="submit"
            colorScheme="teal"
            size="lg"
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
