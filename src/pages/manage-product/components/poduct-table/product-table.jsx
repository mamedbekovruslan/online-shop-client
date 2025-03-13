import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  TableContainer,
  IconButton,
  Skeleton,
  Text,
} from "@chakra-ui/react";
import {
  AiOutlineArrowUp,
  AiOutlineArrowDown,
  AiOutlineEdit,
  AiOutlineDelete,
} from "react-icons/ai";

export const ProductTable = ({
  products,
  loading,
  sortColumn,
  sortOrder,
  handleSort,
  getCategoryNameById,
  handleEditProduct,
  handleDeleteProduct,
}) => (
  <TableContainer>
    <Table size="sm" variant="simple">
      <Thead>
        <Tr>
          <Th onClick={() => handleSort("id")}>
            ID{" "}
            {sortColumn === "id" &&
              (sortOrder === "asc" ? (
                <AiOutlineArrowUp />
              ) : (
                <AiOutlineArrowDown />
              ))}
          </Th>
          <Th onClick={() => handleSort("name")}>
            Наименование{" "}
            {sortColumn === "name" &&
              (sortOrder === "asc" ? (
                <AiOutlineArrowUp />
              ) : (
                <AiOutlineArrowDown />
              ))}
          </Th>
          <Th>Категория</Th>
          <Th onClick={() => handleSort("price")}>
            Стоимость{" "}
            {sortColumn === "price" &&
              (sortOrder === "asc" ? (
                <AiOutlineArrowUp />
              ) : (
                <AiOutlineArrowDown />
              ))}
          </Th>
          <Th onClick={() => handleSort("quantity")}>
            Кол-во{" "}
            {sortColumn === "quantity" &&
              (sortOrder === "asc" ? (
                <AiOutlineArrowUp />
              ) : (
                <AiOutlineArrowDown />
              ))}
          </Th>
          <Th>Фото</Th>
          <Th>Действия</Th>
        </Tr>
      </Thead>
      <Tbody>
        {!loading ? (
          products.map((product) => (
            <Tr key={product.id}>
              <Th>{product.id}</Th>
              <Th>{product.name}</Th>
              <Th>{getCategoryNameById(product.category_id)}</Th>
              <Th>{product.price} р</Th>
              <Th>{product.quantity} шт</Th>
              <Th>
                {product.photo ? (
                  <img
                    src={`http://89.111.170.174:3000${product.photo}`}
                    alt="Фото"
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  "Нет фото"
                )}
              </Th>
              <Th>
                <IconButton
                  aria-label="Редактировать"
                  icon={<AiOutlineEdit />}
                  size="sm"
                  mr={2}
                  onClick={() => handleEditProduct(product)}
                />
                <IconButton
                  aria-label="Удалить"
                  icon={<AiOutlineDelete />}
                  colorScheme="red"
                  size="sm"
                  onClick={() => handleDeleteProduct(product.id)}
                />
              </Th>
            </Tr>
          ))
        ) : (
          <Tr>
            {[...Array(7)].map((_, i) => (
              <Th key={i}>
                <Skeleton height="30px" mb={2} borderRadius="md" />
              </Th>
            ))}
          </Tr>
        )}
      </Tbody>
    </Table>
  </TableContainer>
);
