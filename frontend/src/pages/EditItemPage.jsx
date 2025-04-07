/* eslint-disable no-unused-vars */
import { Field, Form, Formik } from "formik";
import { Link, useParams } from "react-router-dom";
import CustomInput from "../components/CustomInput";
import Button from "../components/Button";
import CustomSelect from "../components/CustomSelect";
import { brands, categories, colors, conditions, sizes } from "../utils/data";
import ImageUpload from "../components/ImageUpload";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getItem, updateItem } from "../http/api";
import toast from "react-hot-toast";
import { updateItemSchema } from "../utils/schemas";

const EditItemPage = () => {
  const { id } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["items", id],
    queryFn: async () => {
      return getItem(id);
    },
    retry: 0,
    // staleTime: 1000 * 60 * 5,
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (formData) => {
      const response = await updateItem(id, formData);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Item updated successfully!");
      queryClient.invalidateQueries(["items", id]);
      window.location.reload();
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to update item.");
    },
  });

  const handleSubmit = async (values, { resetForm }) => {
    const formData = new FormData();
    for (const key in values) {
      if (key === "type") {
        formData.append("type", JSON.stringify(values[key]));
      } else if (key === "images") {
        values[key].forEach((file) => {
          formData.append("images", file);
        });
      } else {
        formData.append(key, values[key]);
      }
    }
    mutation.mutate(formData);
    resetForm();
  };

  if (isLoading)
    return (
      <div className="overflow-hidden">
        <div className="flex gap-3 my-4  h-screen w-screen justify-center items-center">
          <div className="loader"></div>
          <p className="font-semibold text-xl ml-3 uppercase">Loading....</p>
        </div>
      </div>
    );

  const item = data?.data;

  return (
    <div>
      <div className="flex justify-between">
        <h2 className="text-xl uppercase font-semibold">Edit Item</h2>
        <Link className="btn btn-primary w-32" to="/dashboard/listings">
          Go Back
        </Link>
      </div>
      <div className="mt-6">
        <Formik
          initialValues={{
            name: item?.name || "",
            description: item?.description || "",
            images: item?.images || [],
            price: item?.price || "",
            discount: item?.discount || "",
            type: item?.type || {
              buy: true,
              rent: false,
              swap: false,
            },
            rentPerDay: item?.rentPerDay || "",
            swapWith: item?.swapWith || "",
            category: item?.category || "",
            brand: item?.brand || "",
            condition: item?.condition || "",
            size: item?.size || "",
            color: item?.color || "",
            // removedImages: [],
          }}
          validationSchema={updateItemSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, values, errors }) => {
            console.log(errors);

            return (
              <Form className="flex flex-col gap-y-5 mx-auto">
                <Field name="name">
                  {({ field }) => (
                    <CustomInput
                      label="Name:"
                      {...field}
                      placeholder="Name"
                      type="text"
                    />
                  )}
                </Field>
                <Field name="description">
                  {({ field }) => (
                    <CustomInput
                      label="Description"
                      {...field}
                      placeholder="Description"
                      type="text"
                    />
                  )}
                </Field>
                <Field name="price">
                  {({ field }) => (
                    <CustomInput
                      label="Price:"
                      {...field}
                      placeholder="Price"
                      type="number"
                    />
                  )}
                </Field>
                <Field name="discount">
                  {({ field }) => (
                    <CustomInput
                      label="Discount Price"
                      {...field}
                      placeholder="Discount (optional)"
                      type="number"
                    />
                  )}
                </Field>
                <Field name="images">
                  {({ field, form }) => (
                    <ImageUpload
                      field={field}
                      form={form}
                      setFieldValue={setFieldValue}
                      existingImages={item?.images || []}
                    />
                  )}
                </Field>
                <div className="flex gap-4 mt-4">
                  <label className="flex gap-3 items-center">
                    <Field type="checkbox" name="type.buy" className="w-6 h-6" />
                    <span>For Sale</span>
                  </label>
                  <label className="flex gap-3 items-center">
                    <Field type="checkbox" name="type.rent" className="w-6 h-6" />
                    <span>For Rent</span>
                  </label>
                  <label className="flex gap-3 items-center">
                    <Field type="checkbox" name="type.swap" className="w-6 h-6" />
                    <span>For Swap</span>
                  </label>
                </div>
                {values.type.rent && (
                  <Field name="rentPerDay">
                    {({ field }) => (
                      <CustomInput
                        label="Rent per day:"
                        {...field}
                        placeholder="Rent Per Day"
                        type="number"
                      />
                    )}
                  </Field>
                )}
                {values.type.swap && (
                  <Field name="swapWith">
                    {({ field }) => (
                      <CustomInput
                        {...field}
                        placeholder="Swap With (category name)"
                        type="text"
                      />
                    )}
                  </Field>
                )}

                <Field name="category">
                  {({ field }) => {
                    return (
                      <CustomSelect label="Category:" {...field} options={categories} />
                    );
                  }}
                </Field>

                <Field name="brand">
                  {({ field }) => {
                    return <CustomSelect label="Brand:" {...field} options={brands} />;
                  }}
                </Field>

                <Field name="color">
                  {({ field }) => {
                    return <CustomSelect label="Color:" {...field} options={colors} />;
                  }}
                </Field>

                <Field name="size">
                  {({ field }) => {
                    return <CustomSelect label="Size:" {...field} options={sizes} />;
                  }}
                </Field>

                <Field name="condition">
                  {({ field }) => {
                    return (
                      <CustomSelect label="Condition:" {...field} options={conditions} />
                    );
                  }}
                </Field>

                <Button isPending={mutation.isPending} type="submit" width="200px">
                  Update Item
                </Button>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default EditItemPage;
