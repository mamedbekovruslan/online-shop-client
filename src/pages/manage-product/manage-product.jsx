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
  Box,
  IconButton,
  Text,
  useBreakpointValue,
  VStack,
  Spinner,
  Skeleton,
} from "@chakra-ui/react";
import {
  AiOutlineArrowUp,
  AiOutlineArrowDown,
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineUpload,
} from "react-icons/ai";
import { useState, useEffect } from "react";
import {
  addProduct,
  deleteProduct,
  getCategories,
  getProducts,
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
  const [imageFile, setImageFile] = useState(null);
  const [loadingProducts, setLoadingProdutcts] = useState(false);

  const isMobile = useBreakpointValue({ base: true, md: false });

  const [newProduct, setNewProduct] = useState({
    name: "",
    category_id: "",
    price: "",
    quantity: "",
    photo: "",
  });

  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProdutcts(true);
      try {
        const response = await getProducts();
        setProducts(response.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoadingProdutcts(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.data);
        const defaultCategory = response.data.find(
          (cat) => cat.name.toLowerCase() === "смартфоны"
        );
        if (defaultCategory) {
          setNewProduct((prev) => ({
            ...prev,
            category_id: defaultCategory.id,
          }));
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleEditProduct = (product) => {
    setIsEditing(true);
    setSelectedProductId(product.id);
    setNewProduct({
      name: product.name,
      category_id: product.category_id,
      price: product.price,
      quantity: product.quantity,
      photo: product.photo,
    });
  };

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
      const formData = new FormData();
      formData.append("name", newProduct.name);
      formData.append("category_id", newProduct.category_id);
      formData.append("price", newProduct.price);
      formData.append("quantity", newProduct.quantity);
      if (imageFile) {
        formData.append("photo", imageFile, imageFile.name);
      }

      if (isEditing) {
        const response = await patchProduct(selectedProductId, formData);
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id === selectedProductId ? response.data : product
          )
        );
      } else {
        const response = await addProduct(formData);
        setProducts([...products, response.data]);
      }

      setNewProduct({
        name: "",
        category_id: "",
        price: "",
        quantity: "",
        photo: "",
      });
      setImageFile(null);
      setIsEditing(false);
    } catch (err) {
      console.error("Ошибка сохранения товара:", err);
      alert("Ошибка при сохранении товара");
    }
  };

  const getCategoryNameById = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Неизвестно";
  };

  return (
    <Flex direction="column">
      <Text fontSize="2xl" mb={4} textAlign={{ base: "center", md: "left" }}>
        {isEditing ? "Редактирование товара" : "Добавление товара"}
      </Text>

      <Flex direction={{ base: "column", lg: "row" }} gap={6}>
        <VStack spacing={4} w={{ base: "100%", lg: "25%" }}>
          <FormControl id="name">
            <FormLabel>Название товара</FormLabel>
            <Input
              name="name"
              value={newProduct.name}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl id="category">
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
          <FormControl id="price">
            <FormLabel>Цена</FormLabel>
            <Input
              name="price"
              type="number"
              value={newProduct.price}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl id="quantity">
            <FormLabel>Количество</FormLabel>
            <Input
              name="quantity"
              type="number"
              value={newProduct.quantity}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl id="image">
            <FormLabel>Фото</FormLabel>
            <Button
              as="label"
              htmlFor="file-upload"
              cursor="pointer"
              leftIcon={<AiOutlineUpload />}
              colorScheme="teal"
              variant="outline"
              width="100%"
            >
              Загрузить фото
            </Button>
            <Input
              id="file-upload"
              type="file"
              accept="image/*"
              display="none"
              onChange={handleImageChange}
            />
            {imageFile && (
              <Text fontSize="sm" mt={2}>
                Выбран файл: {imageFile.name}
              </Text>
            )}
          </FormControl>
          <Button colorScheme="teal" onClick={handleSaveProduct} w="100%">
            {isEditing ? "Сохранить изменения" : "Добавить товар"}
          </Button>
        </VStack>

        <Box w={{ base: "100%", lg: "75%" }}>
          <Flex mb={4} gap={4} direction={{ base: "column", md: "row" }}>
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
                  <Th w="100px" maxW="100px">
                    Фото
                  </Th>
                  <Th>Действия</Th>
                </Tr>
              </Thead>
              <Tbody>
                {!loadingProducts ? (
                  filteredProducts.map((product) => (
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
                          colorScheme="gray"
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
                    <Th>
                      <Skeleton height="30px" mb={2} borderRadius="md" />
                    </Th>
                    <Th>
                      <Skeleton height="30px" mb={2} borderRadius="md" />
                    </Th>
                    <Th>
                      <Skeleton height="30px" mb={2} borderRadius="md" />
                    </Th>
                    <Th>
                      <Skeleton height="30px" mb={2} borderRadius="md" />
                    </Th>
                    <Th>
                      <Skeleton height="30px" mb={2} borderRadius="md" />
                    </Th>
                    <Th>
                      <Skeleton height="30px" mb={2} borderRadius="md" />
                    </Th>
                    <Th>
                      <Skeleton height="30px" mb={2} borderRadius="md" />
                    </Th>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Удалить товар</ModalHeader>
          <ModalBody>Вы действительно хотите удалить этот товар?</ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Нет</Button>
            <Button colorScheme="red" onClick={confirmDelete} ml={3}>
              Да
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};
