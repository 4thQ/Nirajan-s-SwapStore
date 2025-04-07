import { useQuery } from "@tanstack/react-query";
import Navbar from "../components/Navbar";
import { getItems, getWishlists } from "../http/api";
import ItemCard from "../components/ItemCard";
import { useEffect, useState } from "react";
import { brands, categories, colors, conditions } from "../utils/data";
import { useLocation } from "react-router-dom";
import Footer from "../components/Footer";

const ItemsPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialSearch = queryParams.get("search") || "";
  const [filters, setFilters] = useState({
    category: "",
    type: "",
    brand: "",
    condition: "",
    search: initialSearch,
    color: "",
    sortBy: "newest",
  });
  const { data, isLoading } = useQuery({
    queryKey: ["items", filters],
    queryFn: () => getItems(filters),
    retry: 0,
    // staleTime: 1000 * 60 * 5,
  });
  const items = data?.data;

  const { data: wishlistsResponse } = useQuery({
    queryKey: ["wishlists"],
    queryFn: getWishlists,
    retry: 0,
    staleTime: 1000 * 60 * 5, // Optional: cache data for 5 minutes
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };
  useEffect(() => {
    const newSearch = queryParams.get("search") || "";
    setFilters((prevFilters) => ({ ...prevFilters, search: newSearch }));
  }, [location.search]);

  if (isLoading) {
    return (
      <div className="overflow-hidden">
        <div className="flex gap-3 my-4  h-screen w-screen justify-center items-center">
          <div className="loader"></div>
          <p className="font-semibold text-xl ml-3 uppercase">Loading....</p>
        </div>
      </div>
    );
  }
  const wishlists = wishlistsResponse?.data;
  return (
    <div>
      <Navbar search={filters.search} />
      <div className="my-10">
        {/* FILTERS */}
        <div className="container flex gap-4 ">
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 w-full">
            <div className="flex-1">
              <label htmlFor="category" className="block mb-2 font-semibold">
                Category:
              </label>
              <select
                id="category"
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="">All Categories</option>
                {categories?.map((category) => {
                  return (
                    <option value={category?.value} key={category?.value}>
                      {category?.label}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="flex-1">
              <label htmlFor="type" className="block mb-2 font-semibold">
                Type:
              </label>
              <select
                id="type"
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="">All Types</option>
                <option value="buy">Buy</option>
                <option value="rent">Rent</option>
                <option value="swap">Swap</option>
              </select>
            </div>

            <div className="flex-1">
              <label htmlFor="brand" className="block mb-2 font-semibold">
                Brand:
              </label>
              <select
                id="brand"
                name="brand"
                value={filters.brand}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="">All Brands</option>
                {brands?.map((brand) => {
                  return (
                    <option value={brand?.value} key={brand?.value}>
                      {brand?.label}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="flex-1">
              <label htmlFor="brand" className="block mb-2 font-semibold">
                Color:
              </label>
              <select
                id="color"
                name="color"
                value={filters.color}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="">All Color</option>
                {colors?.map((color) => {
                  return (
                    <option value={color?.value} key={color?.value}>
                      {color?.label}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="flex-1">
              <label htmlFor="condition" className="block mb-2 font-semibold">
                Condition:
              </label>
              <select
                id="condition"
                name="condition"
                value={filters.condition}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="">All Conditions</option>
                {conditions?.map((condition) => {
                  return (
                    <option value={condition?.value} key={condition?.value}>
                      {condition?.label}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="flex-1">
              <label htmlFor="condition" className="block mb-2 font-semibold">
                Sort By:
              </label>
              <select
                id="sortBy"
                name="sortBy"
                value={filters.sortBy}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        </div>
        <br />
        <div className="container mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
          {items?.map((item) => {
            return (
              <ItemCard wishlists={wishlists} key={item?._id} item={item} type="all" />
            );
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
};
export default ItemsPage;
