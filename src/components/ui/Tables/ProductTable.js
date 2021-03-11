import React, { useEffect, useRef, useState } from 'react'

import dayjs from 'dayjs'
import ReactPaginate from 'react-paginate'
import Select from 'react-select'

import { Btn } from '../Buttons/Btn';
import { Modal } from '../../shared/Modal';
import { ProductForm } from '../Forms/ProductForm';
import { useDispatch, useSelector } from 'react-redux';
import { BtnFloat } from '../Buttons/BtnFloat';

import { startGettingCategories } from '../../../actions/categories';
import { startCleaningActiveProduct, startEditingProduct, startDeletingProduct } from '../../../actions/products';
import { swalCustomStyle } from '../../../helpers/swalCustom';
import Swal from 'sweetalert2';

export const ProductTable = ({columns, data:products}) => {
    const [offset, setOffset] = useState(0);
    const [perPage, setPerPage] = useState(5);
    const [pageCount, setPageCount] = useState(0);
    const [data, setData] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [statusFilter, setStatusFilter] = useState(2);
    const [discountFilter, setDiscountFilter] = useState(2);

    const [openModal, setOpenModal] = useState(false);

    const handleInputChange = (e) => {
        setSearchInput(e.target.value)
    }

    const handleStatusFilter = (e) => {
        setStatusFilter(parseInt(e.target.value));
    }

    const handleDiscountFilter = (e) => {
        setDiscountFilter(parseInt(e.target.value));
    }

    const handleCreateProduct = () =>{
        dispatch(startCleaningActiveProduct());
        setOpenModal(true);
    }

    const handleEditProduct = (id, name, description, category_id, price, in_discount, discount, status, get_pictures) => {
        const product = {
            id,
            name, 
            description, 
            category_id, 
            price, 
            in_discount, 
            discount, 
            status,
            get_pictures
        };
        
        dispatch(startEditingProduct(product));
        setOpenModal(true);
    }

    const handleDeleteProduct = (id) => {
        swalCustomStyle.fire({
            title: 'Are you sure?',
            text: "If you confirm this action, it will delete this product and its pictures permanently",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
            reverseButtons: true,
            focusCancel: true,
          }).then((result) => {
            if (result.isConfirmed) {
                dispatch(startDeletingProduct(id));
                swalCustomStyle.fire({
                    icon: 'info',
                    title: 'Deleting product and pictures...',
                    showConfirmButton: false,
                    timer: 1500
                })
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                swalCustomStyle.fire('Cancelled','This category is safe','info')
            }
          })
        // dispatch(startDeletingProduct(id));
    }

    const {productActive} = useSelector(state => state.products)

    useEffect(() => {
        let slice = [];
        let productsFiltered = [];
        if( searchInput !== ''){
            productsFiltered.length > 0
            ? productsFiltered = productsFiltered.filter( product => product.name.toLowerCase().includes(searchInput.toLowerCase()))
            : productsFiltered = products.filter( product => product.name.toLowerCase().includes(searchInput.toLowerCase()))
            slice = productsFiltered.slice(offset, offset + perPage)
            setPageCount(Math.ceil(productsFiltered.length / perPage))
        }

        if( statusFilter !== 2){
            productsFiltered.length > 0
            ? productsFiltered = productsFiltered.filter( p => p.status === parseInt(statusFilter))
            : productsFiltered = products.filter( p => p.status === parseInt(statusFilter))
            
            slice = productsFiltered.slice(offset, offset + perPage)
            setPageCount(Math.ceil(productsFiltered.length / perPage))
        }

        if( discountFilter !== 2){
            productsFiltered.length > 0
            ? productsFiltered = productsFiltered.filter( p => p.in_discount === parseInt(discountFilter) )
            : productsFiltered = products.filter( p => p.in_discount === parseInt(discountFilter) )
            slice = productsFiltered.slice(offset, offset + perPage)
            setPageCount(Math.ceil(productsFiltered.length / perPage))
        }
        
        if(searchInput === '' && statusFilter === 2 && discountFilter === 2){
            slice = products.slice(offset, offset + perPage)
            setPageCount(Math.ceil(products.length / perPage))
        }

        const postData = slice.map( ({id, name, description, category_id, price, in_discount, discount, status, created_at, get_pictures}) => 
            <tr key={id}>
                <td className="col-2">{name}</td>
                <td className="col-2">{description}</td>
                <td className="col-2">{price}</td>
                <td className="col-2">{in_discount === 1 ? 'Yes' : 'No'}</td>
                {
                    (in_discount === 1)
                    ? <td className="col-2">{discount} %</td>
                    : <td className="col-2">-</td>
                }
                <td className="col-2">{status === 1 ? 'Public' : 'Draft'}</td>
                <td className="col-2">{ dayjs(created_at).format('DD/MM/YYYY HH:mm:ss')}</td>
                <td className="col-2 d-flex flex-wrap flex-row place-items-center">
                    <div onClick={() => handleEditProduct(id, name, description, category_id, price, in_discount, discount, status, get_pictures)}>
                        <Btn color="edit" md="3" sm="3" css="btn-options btn-sm mx-1 tooltip">
                            <i className="fas fa-pen"></i>
                            <span className="tooltiptext">Edit product</span>
                        </Btn>
                    </div>
                    <div onClick={() => handleDeleteProduct(id)}>
                        <Btn color="delete" md="3" sm="3" css="btn-options btn-sm mx-1 tooltip">
                            <i className="fas fa-trash"></i>
                            <span className="tooltiptext">Delete product</span>
                        </Btn>
                    </div>
                </td>
            </tr>
        );
        setData(postData)
        
    }, [offset, perPage, products, searchInput, statusFilter, discountFilter])

    
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(startGettingCategories());
    }, [dispatch])

    const {categories} = useSelector(state => state.categories)

    const [selectedOption, setSelectedOption] = useState({value: "5", label: "5 items"})
    const options = [
        { value: '5', label: '5 items' },
        { value: '10', label: '10 items' },
        { value: '15', label: '15 items' },
    ];

    const handlePageClick = (e) => {
        const {selected} = e;
        setOffset(selected * perPage)
    };

    const handleSelectItems = (e) =>{
        setPerPage(e.value);
        setSelectedOption(e);
    }

    const customStyles = {
        option: (provided, state) => ({
            ...provided,
            borderBottom: '1px solid var(--border-color-table)',
            color: state.isSelected ? 'var(--colorText)' : 'var(--main-color)',
            padding: 5,
            textAlign: 'left',
        })
    }

    const filterRef = useRef();
    const handleToggleFilter = () => {
        filterRef.current.classList.toggle('d-none');
    }

    return (
        <>
            <div>
                <div onClick={handleCreateProduct}>
                    <BtnFloat color="create-full"> 
                        <i className="fas fa-plus"/>
                        <span className="ml-3">New product</span>
                    </BtnFloat>
                </div>
            </div>
            <div className="table__header ">
                <div className="table__header-filters">
                    <div className="filter-options d-none" ref={filterRef}>
                        <div className="mr-2 ml-1">
                            <select defaultValue={statusFilter} onChange={handleStatusFilter}>
                                <option value="0">Draft</option>
                                <option value="1">Public</option>
                                <option value="2">Status</option>
                            </select>
                        </div>
                        <div className="mr-2">
                            <select defaultValue={discountFilter} onChange={handleDiscountFilter}>
                                <option value="0">No</option>
                                <option value="1">Yes</option>
                                <option value="2">Discount?</option>
                            </select>
                        </div>
                        <div className="searchInput">
                            <input 
                                type="text" 
                                name="search"
                                value={searchInput}
                                onChange={handleInputChange}
                                placeholder="Search product"
                            />
                            <div className="icon-search">
                                <i className="fas fa-search"></i>
                            </div>
                        </div>
                    </div>
                    <div className="btn-filter">
                        <i className="fas fa-filter p-2 pointer" onClick={handleToggleFilter}/>
                    </div>
                </div>
            </div>
            <table>
                <thead>
                    <tr>
                        {   
                            columns.map( column => (
                                <th className="col-2" key={column}>{column}</th>
                            ))
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        data.length > 0
                        ? (data)
                        : (<tr>
                           <td colSpan={columns.length} className="col-12 text-center">No data found</td> 
                        </tr>)
                    }
                </tbody>
            </table>

            <div className="table__footer mt-5">
                <div className="subrow justify-content-center align-items-center">
                    {
                        pageCount > 0
                        &&
                    
                        <ReactPaginate
                            previousLabel={<i className="fas fa-arrow-left"></i>}
                            nextLabel={<i className="fas fa-arrow-right"></i>}
                            breakLabel={"..."}
                            breakClassName={"break-me"}
                            pageCount={pageCount}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={3}
                            onPageChange={handlePageClick}
                            containerClassName={"pagination"}
                            subContainerClassName={"pages pagination"}
                            activeClassName={"active"}    
                        />
                    }
                    {
                        pageCount > 0
                        &&

                        <Select
                            value={selectedOption}
                            onChange={handleSelectItems}
                            options={options}
                            styles={customStyles}
                        />
                    }
                    
                </div>
            </div>

            {
                Object.keys(productActive).length <= 0
                ?
                <Modal title="Add new product" isOpen={openModal} onClose={() => setOpenModal(false)} >
                    <ProductForm 
                        categories={categories} 
                        closeModal={()=>setOpenModal(false) } 
                        product={productActive}/>
                </Modal>
                :
                <Modal title="Edit product" isOpen={openModal} onClose={() => setOpenModal(false)} >
                    <ProductForm 
                        categories={categories} 
                        closeModal={()=>setOpenModal(false)}
                        product={productActive}
                    />
                </Modal>

            }
        </>
    )
}
