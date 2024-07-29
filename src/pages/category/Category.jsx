import React, { useEffect, useState } from 'react';
import './Category.css';

// Modal component
function Modal({ show, onClose, onSave, category }) {
    const [nameEn, setNameEn] = useState(category ? category.name_en : '');
    const [nameRu, setNameRu] = useState(category ? category.name_ru : '');
    const [image, setImage] = useState(null);

    useEffect(() => {
        if (category) {
            setNameEn(category.name_en);
            setNameRu(category.name_ru);
        } else {
            setNameEn('');
            setNameRu('');
            setImage(null);
        }
    }, [category]);

    if (!show) {
        return null;
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
    };

    const handleSave = () => {
        const formData = new FormData();
        formData.append('name_en', nameEn);
        formData.append('name_ru', nameRu);
        if (image) {
            formData.append('image', image);
        }

        onSave(formData);
    };

    return (
        <div className='modal-overlay'>
            <div className='modal'>
                <h2>{category ? 'Edit Category' : 'Add Category'}</h2>
                <label>Name EN:</label>
                <input type="text" value={nameEn} onChange={(e) => setNameEn(e.target.value)} />
                <label>Name RU:</label>
                <input type="text" value={nameRu} onChange={(e) => setNameRu(e.target.value)} />
                <label>Image:</label>
                <input type="file" accept="image/*" onChange={handleImageChange} />
                <div className='modal-buttons'>
                    <button className='cancel_btn' onClick={onClose}>Cancel</button>
                    <button className='save_btn' onClick={handleSave}>{category ? 'Save' : 'Add'}</button>
                </div>
            </div>
        </div>
    );
}

// Category component
export default function Category() {
    const [categories, setCategories] = useState([]);
    const [currentCategory, setCurrentCategory] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const urlImg = 'https://autoapi.dezinfeksiyatashkent.uz/api/uploads/images/';

    const getCategory = () => {
        fetch('https://autoapi.dezinfeksiyatashkent.uz/api/categories')
            .then(res => res.json())
            .then(data => {
                setCategories(data.data);
            });
    };

    const handleEditClick = (item) => {
        setCurrentCategory(item);
        setShowModal(true);
    };

    const handleAddClick = () => {
        setCurrentCategory(null);
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setCurrentCategory(null);
    };

    const handleSave = (formData) => {
        if (currentCategory) {
            // Update the category locally
            const updatedCategory = { ...currentCategory, name_en: formData.get('name_en'), name_ru: formData.get('name_ru') };
            if (formData.has('image')) {
                updatedCategory.image_src = formData.get('image').name;
            }
            setCategories(categories.map(cat => cat.id === updatedCategory.id ? updatedCategory : cat));
            // Make an API call to save the updated category on the server
            fetch(`https://autoapi.dezinfeksiyatashkent.uz/api/categories/${updatedCategory.id}`, {
                method: 'PUT',
                body: formData,
            }).then(response => {
                if (response.ok) {
                    console.log('Category updated successfully');
                    getCategory(); // Refresh the category list
                } else {
                    console.error('Failed to update category');
                }
            });
        } else {
            // Add the new category locally
            fetch(`https://autoapi.dezinfeksiyatashkent.uz/api/categories`, {
                method: 'POST',
                body: formData,
            }).then(response => {
                if (response.ok) {
                    console.log('Category added successfully');
                    getCategory(); // Refresh the category list after adding a new category
                } else {
                    console.error('Failed to add category');
                }
            });
        }
        handleModalClose();
    };

    const handleDeleteClick = (id) => {
        setCategories(categories.filter(cat => cat.id !== id));
        fetch(`https://autoapi.dezinfeksiyatashkent.uz/api/categories/${id}`, {
            method: 'DELETE',
        }).then(response => {
            if (response.ok) {
                console.log('Category deleted successfully');
                getCategory(); // Refresh the category list
            } else {
                console.error('Failed to delete category');
            }
        });
    };

    useEffect(() => {
        getCategory();
    }, []);

    return (
        <div className='category'>
            <button className='add-category-btn' onClick={handleAddClick}>Add Category</button>
            <table border={1}>
                <thead>
                    <tr>
                        <th>Name EN</th>
                        <th>Name RU</th>
                        <th>Images</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        categories && categories.map((item, index) => (
                            <tr key={index}>
                                <td>{item.name_en}</td>
                                <td>{item.name_ru}</td>
                                <td>
                                    <img src={`${urlImg}${item.image_src}`} alt={item.name_en} />
                                </td>
                                <td>
                                    <button className='edit' onClick={() => handleEditClick(item)}>Edit</button>
                                    <button className='delete' onClick={() => handleDeleteClick(item.id)}>Delete</button>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
            <Modal
                show={showModal}
                onClose={handleModalClose}
                onSave={handleSave}
                category={currentCategory}
            />
        </div>
    );
}
