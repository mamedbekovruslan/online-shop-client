import { Box, Text, Spinner, VStack, Badge, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { getAllOrders } from "../../api/auth";

export const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getAllOrders();
        setOrders(res.data);
      } catch (err) {
        console.error("Ошибка при загрузке всех заказов", err);
        toast({
          title: "Ошибка при загрузке заказов",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <Spinner size="xl" />;

  return (
    <Box>
      <Text fontSize="2xl" mb={4}>
        Все заказы
      </Text>
      {orders.length === 0 ? (
        <Text>Нет заказов</Text>
      ) : (
        <VStack align="stretch" spacing={4}>
          {orders.map((order) => (
            <Box key={order.id} border="1px solid #ccc" borderRadius="md" p={4}>
              <Text>
                <strong>ID:</strong> {order.id}
              </Text>
              <Text>
                <strong>Имя:</strong> {order.customer_name}
              </Text>
              <Text>
                <strong>Email:</strong> {order.customer_email}
              </Text>
              <Text>
                <strong>Дата:</strong>{" "}
                {new Date(order.order_date).toLocaleString()}
              </Text>
              <Text>
                <strong>Сумма:</strong> {order.total} р.
              </Text>
              <Text>
                <strong>Статус:</strong> <Badge>{order.status}</Badge>
              </Text>

              <Box mt={3}>
                <Text fontWeight="bold">Товары:</Text>
                <VStack align="start" spacing={1} mt={1}>
                  {order.items.map((item, index) => (
                    <Text key={index}>
                      • {item.name} — {item.quantity} шт. × {item.price} р.
                    </Text>
                  ))}
                </VStack>
              </Box>
            </Box>
          ))}
        </VStack>
      )}
    </Box>
  );
};
