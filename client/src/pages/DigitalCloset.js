import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import ClosetNavigation from '../components/ClosetNavigation';
import CategoriesSidebar from '../components/CategoriesSidebar';
import Loading from '../components/Loading';

const Container = styled.div`
    flex: 1;
    font-family: 'Fashion';
    display: flex;
`;

export default function DigitalCloset() {
    const { client } = useLocation().state;

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [category, setCategory] = useState({});
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getCategories();
    }, []);
    
    async function getCategories() {
        const response = await axios.get('/categories')
            .catch(err => console.log(err));
        
        let categories = response.data;
        const allItems = [];
        if (categories.length > 1) {
            categories.forEach(category => {
                allItems.push(category.items);
            });

            const allCategory = {
                _id: -1,
                name: 'All',
                items: allItems
            };

            categories = [allCategory, ...categories];
            setCategory(allCategory);
        }

        setCategories(categories);
    }

    async function editCategory(category, newName) {
        setLoading(true);
        if (category.name === newName) {
            setLoading(false);
            return;
        }

        await axios.patch('/categories', { categoryId: category._id, newName: newName })
            .catch(err => console.log(err));
        
        await getCategories();
        setLoading(false);
    }
    
    async function deleteCategory(category) {
        setLoading(true);
        
        await axios.delete(`/categories/${category._id}`)
            .catch(err => console.log(err));
        
        await getCategories();
        setLoading(false);
    }

    function openSidebar() {
        setSidebarOpen(true);
    }

    function closeSidebar() {
        setSidebarOpen(false);
    }

    function selectCategory(category) {
        setCategory(category);
    };

    return (
        <>
            <Container>
                <CategoriesSidebar
                    open={sidebarOpen}
                    closeSidebar={closeSidebar}
                    categories={categories}
                    selectCategory={selectCategory}
                    updateCategories={getCategories}
                    editCategory={editCategory}
                    deleteCategory={deleteCategory}
                />
                <ClosetNavigation
                    client={client}
                    category={category}
                    open={sidebarOpen}
                    openSidebar={openSidebar}
                />
            </Container>
            <Loading open={loading} />
        </>
    )
}
