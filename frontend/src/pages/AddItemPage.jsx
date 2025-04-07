/* eslint-disable no-unused-vars */
import { Field, Form, Formik } from "formik";
import { Link } from "react-router-dom";
import { addItemSchema } from "../utils/schemas";
import CustomInput from "../components/CustomInput";
import Button from "../components/Button";
import CustomSelect from "../components/CustomSelect";
import { brands, categories, colors, conditions, sizes } from "../utils/data";
import ImageUpload from "../components/ImageUpload";
import { useMutation } from "@tanstack/react-query";
import { addItem } from "../http/api";
import toast from "react-hot-toast";

const AddItemPage = () => {
  const mutation = useMutation({
    mutationFn: async (formData) => {
      const response = await addItem(formData);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Item added successfully!");
      window.location.reload();
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to add item.");
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
  return (
    <div>
      <div className="flex justify-between">
        <h2 className="text-xl uppercase font-semibold">Add New Item</h2>
        <Link className="btn btn-primary w-32" to="/dashboard/listings">
          Go Back
        </Link>
      </div>
      <div className="mt-6">
        <Formik
          initialValues={{
            name: "",
            description: "",
            images: [],
            price: "",
            discount: "",
            type: {
              buy: true,
              rent: false,
              swap: false,
            },
            rentPerDay: "",
            swapWith: "",
            category: "",
            brand: "",
            condition: "",
            color: "",
            size: "",
          }}
          validationSchema={addItemSchema}
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
                  Add Item
                </Button>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};
export default AddItemPage;
