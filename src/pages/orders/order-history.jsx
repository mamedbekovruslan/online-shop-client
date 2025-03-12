import { Box, Text, Spinner, VStack, Badge, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getOrder } from "../../api/auth";

export const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/auth");
          return;
        }

        const response = await getOrder();

        setOrders(response.data);
      } catch (err) {
        console.error("Ошибка при получении заказов", err);
        toast({
          title: "Ошибка загрузки заказов",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate, toast]);

  if (loading) return <Spinner size="xl" />;

  return (
    <Box>
      <Text fontSize="2xl" mb={4}>
        Мои заказы
      </Text>

      {orders.length === 0 ? (
        <Text>У вас нет заказов.</Text>
      ) : (
        <VStack align="stretch" spacing={4}>
          {orders.map((order) => (
            <Box key={order.id} border="1px solid #ccc" borderRadius="md" p={4}>
              <Text>
                <strong>Номер заказа:</strong> {order.id}
              </Text>
              <Text>
                <strong>Дата:</strong>{" "}
                {new Date(order.order_date).toLocaleString()}
              </Text>
              <Text>
                <strong>Сумма:</strong> {order.total} р.
              </Text>
              <Text>
                <strong>Статус:</strong>{" "}
                <Badge colorScheme="blue">{order.status}</Badge>
              </Text>
            </Box>
          ))}
        </VStack>
      )}
    </Box>
  );
};
