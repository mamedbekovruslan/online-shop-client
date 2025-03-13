// src/components/auth/AuthFormComponents.jsx
import { FormControl, FormLabel, Input, Text } from "@chakra-ui/react";

export const NameInput = ({ register, errors }) => (
  <FormControl isInvalid={errors.name}>
    <FormLabel>Имя</FormLabel>
    <Input {...register("name")} placeholder="Введите ваше имя" />
    <Text color="red.500" fontSize="sm">
      {errors.name?.message}
    </Text>
  </FormControl>
);

export const EmailInput = ({ register, errors }) => (
  <FormControl isInvalid={errors.email}>
    <FormLabel>Email</FormLabel>
    <Input {...register("email")} placeholder="Введите ваш email" />
    <Text color="red.500" fontSize="sm">
      {errors.email?.message}
    </Text>
  </FormControl>
);

export const UsernameInput = ({ register, errors }) => (
  <FormControl isInvalid={errors.username}>
    <FormLabel>Логин</FormLabel>
    <Input {...register("username")} placeholder="Введите ваш логин" />
    <Text color="red.500" fontSize="sm">
      {errors.username?.message}
    </Text>
  </FormControl>
);

export const PasswordInput = ({ register, errors }) => (
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
);
