import { useState } from "react";
import "../../index.css";
import { useEffect } from "react";
import { Modal } from "antd";

function Locations() {
  const [location, setLocation] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [name, setName] = useState("")
  const [text, setText] = useState("");
  const [photo, setPhoto] = useState("");
  const [id, setId] = useState(null);
  const formData = new FormData()
  formData.append = ("name", name)
  formData.append = ("text", text);
  formData.append = ("images", photo)
  console.log(photo)
  const token = localStorage.getItem('token');

      const getData = () => {
    fetch("https://autoapi.dezinfeksiyatashkent.uz/api/locations")
      .then((res) => res.json())
      .then((data) => {
        setLocation(data?.data);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  const handleAddModal = () => {
  setAddModalOpen(true);
  };
  const handleClose = () => {
    setAddModalOpen(false);
  };
  const handleOk = (id) => {
    setId(id)
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const addLocation = (e) => {
    e.preventDefault()
    fetch(`https://autoapi.dezinfeksiyatashkent.uz/api/locations`, {
      method: "POST",
      body: formData,
      header: {
        // "Content-type": "multipart/formdata",
        "Authorization": `Bearer ${token}`
      },
    });
  }
  const deleteCategory = (e) => {
    e.preventDefault();
    fetch(`https://autoapi.dezinfeksiyatashkent.uz/api/locations/${id}`, {
      header: {
        Authorization: `Bearer ${token}`,
      },
      method: "DELETE"
    })
      .then((res) => res.json())
      .then(() => {
        const newLocation = location.filter(item=>item.id!==id)
        setLocation(newLocation);
        setIsModalOpen(false)
      });
  };
  return (
    <div>
      <div className="headings flex justify-between">
        <h3 className="text-2xl font-medium">Locations</h3>
        <button
          className="border rounded-md py-2 px-4 bg-blue-600 text-white"
          onClick={handleAddModal}
        >
          Add new
        </button>
      </div>
      <table className="table-fixed w-full mt-8 border">
        <thead>
          <tr>
            <th className="border py-2 text-lg">Name</th>
            <th className="border py-2 text-lg">Slug</th>
            <th className="border py-2 text-lg">Text</th>
            <th className="border py-2 text-lg">Image</th>
            <th className="border py-2 text-lg">Action</th>
          </tr>
        </thead>
        <tbody>
          {location &&
            location.map((item, idx) => (
              <tr className="border" key={idx}>
                <td className="border py-6 px-2">{item.name}</td>
                <td className="border py-6 px-2">{item.slug}</td>
                <td className="border py-6 px-2">{item.text}</td>
                <td className="border py-6 px-2">
                  <img
                    src={`https://autoapi.dezinfeksiyatashkent.uz/api/uploads/images/${item.image_src}`}
                    alt={item.name}
                    className="w-full h-[130px] object-contain "
                  />
                </td>
                <td className="text-center">
                  <button className="border py-2 px-4 mr-2 bg-blue-600 text-white rounded-md">
                    Edit
                  </button>
                  <button
                    className="border py-2 px-4 bg-red-600 text-white rounded-md"
                    onClick={() => handleOk(item.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <Modal
        title="Add new location"
        footer={null}
        open={addModalOpen}
        onCancel={handleClose}
      >
        <form action="">
          <input
            type="text"
            className="w-full p-2 my-4 border"
            placeholder="Name"
            required
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            className="w-full p-2 mb-4 border"
            placeholder="Text"
            required
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files[0])}
            required
          />
          <div className="mt-4 text-end">
            <button
              className="border py-2 px-6 bg-blue-600 text-white rounded-md"
              onClick={addLocation}
            >
              Add
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        title="Delete location"
        footer={null}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p className="text-lg mt-3">Do you really want to delete location?</p>
        <div className="mt-4 text-end">
          <button
            className="bg-red-600 text-white  py-2 px-6 mr-2 rounded-md"
            onClick={deleteCategory}
          >
            Yes
          </button>
          <button
            className="bg-blue-600 text-white py-2 px-6 rounded-md"
            onClick={handleCancel}
          >
            No
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default Locations;
