import { Box, Flex, Text, useDisclosure, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  addProduct,
  deleteProduct,
  getCategories,
  getProducts,
  patchProduct,
} from "../../api/auth";
import {
  DeleteConfirmModal,
  ProductFilter,
  ProductForm,
  ProductTable,
} from "./components";

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
  const toast = useToast();

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

    if (name === "name" && value.length > 20) return;
    if ((name === "price" || name === "quantity") && Number(value) < 0) return;

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
      toast({
        title: "Все поля должны быть заполнены",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
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
      toast({
        title: "Ошибка при сохранении товара",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
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
        <ProductForm
          newProduct={newProduct}
          handleInputChange={handleInputChange}
          categories={categories}
          handleImageChange={handleImageChange}
          imageFile={imageFile}
          handleSaveProduct={handleSaveProduct}
          isEditing={isEditing}
        />
        <Box w={{ base: "100%", lg: "75%" }}>
          <ProductFilter
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            categories={categories}
          />
          <ProductTable
            products={filteredProducts}
            loading={loadingProducts}
            sortColumn={sortColumn}
            sortOrder={sortOrder}
            handleSort={handleSort}
            getCategoryNameById={getCategoryNameById}
            handleEditProduct={handleEditProduct}
            handleDeleteProduct={handleDeleteProduct}
          />
        </Box>
      </Flex>

      <DeleteConfirmModal
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={confirmDelete}
      />
    </Flex>
  );
};
