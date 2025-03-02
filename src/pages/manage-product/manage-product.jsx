import {
  Flex,
  Input,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  TableContainer,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { AiOutlineArrowUp, AiOutlineArrowDown } from "react-icons/ai"; // Иконки сортировки
import { useState, useEffect } from "react";
import {
  addProduct,
  deleteProduct,
  getCategories,
  getProducts,
  updateProduct,
  patchProduct,
} from "../../api/auth";

export const ManageProduct = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [categories, setCategories] = useState([]);

  const [isEditing, setIsEditing] = useState(false);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const [newProduct, setNewProduct] = useState({
    name: "",
    category_id: "",
    price: "",
    quantity: "",
    image: "",
  });

  // Получение товаров и категорий
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  // Фильтрация товаров
  useEffect(() => {
    let filtered = products;

    if (searchQuery) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(
        (product) => product.category_id === Number(selectedCategory)
      );
    }

    setFilteredProducts(filtered);
  }, [searchQuery, selectedCategory, products]);

  // Сортировка товаров
  const handleSort = (column) => {
    const order = sortColumn === column && sortOrder === "asc" ? "desc" : "asc";
    setSortColumn(column);
    setSortOrder(order);

    const sortedProducts = [...filteredProducts].sort((a, b) => {
      if (a[column] < b[column]) return order === "asc" ? -1 : 1;
      if (a[column] > b[column]) return order === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredProducts(sortedProducts);
  };

  // Удаление товара
  const handleDeleteProduct = (id) => {
    setSelectedProductId(id);
    onOpen();
  };

  const confirmDelete = async () => {
    try {
      await deleteProduct(selectedProductId);
      setProducts(
        products.filter((product) => product.id !== selectedProductId)
      );
    } catch (err) {
      console.error("Error deleting product:", err);
    } finally {
      onClose();
    }
  };

  // Обработка изменения полей формы
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  // Редактирование товара
  const handleEditProduct = (product) => {
    setIsEditing(true);
    setSelectedProductId(product.id);
    setNewProduct({
      name: product.name,
      category_id: product.category_id,
      price: product.price,
      quantity: product.quantity,
      image: product.photo,
    });
  };

  // Сохранение товара (добавление или редактирование)
  const handleSaveProduct = async () => {
    if (
      !newProduct.name ||
      !newProduct.category_id ||
      !newProduct.price ||
      !newProduct.quantity
    ) {
      alert("Все поля должны быть заполнены");
      return;
    }

    try {
      const productToUpdate = {
        ...newProduct,
        price: Number(newProduct.price),
        quantity: Number(newProduct.quantity),
        category_id: Number(newProduct.category_id),
        photo: newProduct.image,
      };

      if (isEditing) {
        // Формируем объект обновляемых полей
        const updatedFields = {};
        Object.keys(productToUpdate).forEach((key) => {
          if (productToUpdate[key] !== "" && productToUpdate[key] !== null) {
            updatedFields[key] = productToUpdate[key];
          }
        });

        // Если обновляем все поля - используем updateProduct, иначе patchProduct
        if (
          Object.keys(updatedFields).length === Object.keys(newProduct).length
        ) {
          await updateProduct(selectedProductId, updatedFields);
        } else {
          await patchProduct(selectedProductId, updatedFields);
        }

        setProducts(
          products.map((p) =>
            p.id === selectedProductId ? { ...p, ...updatedFields } : p
          )
        );
        setIsEditing(false);
      } else {
        const response = await addProduct(productToUpdate);
        setProducts([...products, response.data]);
      }

      setNewProduct({
        name: "",
        category_id: "",
        price: "",
        quantity: "",
        image: "",
      });
    } catch (err) {
      console.error("Error saving product:", err);
      alert("Ошибка при сохранении товара");
    }
  };

  const getCategoryNameById = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Неизвестно";
  };

  return (
    <Flex direction="column">
      <h1>{isEditing ? "Редактирование товара" : "Добавление товара"}</h1>
      {/* Форма добавления/редактирования товара */}
      <Flex direction="column" mb={8}>
        <FormControl id="name" mb={4}>
          <FormLabel>Название товара</FormLabel>
          <Input
            name="name"
            value={newProduct.name}
            onChange={handleInputChange}
          />
        </FormControl>
        <FormControl id="category" mb={4}>
          <FormLabel>Категория</FormLabel>
          <Select
            name="category_id"
            value={newProduct.category_id}
            onChange={handleInputChange}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl id="price" mb={4}>
          <FormLabel>Цена</FormLabel>
          <Input
            name="price"
            type="number"
            value={newProduct.price}
            onChange={handleInputChange}
          />
        </FormControl>
        <FormControl id="quantity" mb={4}>
          <FormLabel>Количество</FormLabel>
          <Input
            name="quantity"
            type="number"
            value={newProduct.quantity}
            onChange={handleInputChange}
          />
        </FormControl>
        <FormControl id="image" mb={4}>
          <FormLabel>Фото</FormLabel>
          <Input
            name="image"
            value={newProduct.image}
            onChange={handleInputChange}
          />
        </FormControl>
        <Button colorScheme="blue" onClick={handleSaveProduct}>
          {isEditing ? "Сохранить изменения" : "Добавить товар"}
        </Button>
      </Flex>

      {/* Фильтры */}
      <Flex mb={4} gap={4}>
        <Input
          placeholder="Поиск по наименованию..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Select
          placeholder="Все категории"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
      </Flex>

      {/* Таблица товаров */}
      <TableContainer>
        <Table variant="simple">
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
            {filteredProducts.map((product) => (
              <Tr key={product.id}>
                <Th>{product.id}</Th>
                <Th>{product.name}</Th>
                <Th>{getCategoryNameById(product.category_id)}</Th>
                <Th>{product.price} р</Th>
                <Th>{product.quantity} шт</Th>
                <Th>{product.photo}</Th>
                <Th>
                  <Button onClick={() => handleEditProduct(product)}>
                    Изменить
                  </Button>
                  <Button
                    onClick={() => handleDeleteProduct(product.id)}
                    colorScheme="red"
                  >
                    Удалить
                  </Button>
                </Th>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      {/* Модальное окно для подтверждения удаления */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Удалить товар</ModalHeader>
          <ModalBody>Вы действительно хотите удалить этот товар?</ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Нет</Button>
            <Button colorScheme="red" onClick={confirmDelete}>
              Да
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};
