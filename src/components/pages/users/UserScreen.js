import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { startGettingUsers } from '../../../actions/users';
import { useForm } from '../../../hooks/useForm';
import { BtnSubmit } from '../../ui/Buttons/BtnSubmit';
import { Card } from '../../ui/Cards/Card';
import { CardMenu } from '../../ui/Cards/CardMenu';
import { Table } from '../../ui/Table/Table';
import { DateComponent } from '../shared/DateComponent';

export const UserScreen = () => {

    const [isDisable, setIsDisable] = useState(true)

    // Form
    const {name, lastname, email} = useSelector(state => state.auth)
    const [formData, handleInputChange] = useForm({
        eName: name,
        eLastname: lastname,
        eEmail: email
    })

    const {eName, eLastname, eEmail} = formData
    const handleSubmit = (e) => {
        e.preventDefault();
        setIsDisable(true);
        const dateToUpdate = {
            'name': formData.eName,
            'lastname': formData.eLastname,
            'email': formData.eEmail,
        }
        console.log(dateToUpdate)
    }
    
    const dispatch = useDispatch()
    
    useEffect(() => {
        dispatch(startGettingUsers())
    }, [dispatch])

    // Table
    const {users} = useSelector(state => state.users)
    const colums = ["Name","Lastname","Email","Role","Status","Last connection","Actions"]

    // Banners
    const usersActive = users.filter( user => user.status === 0).length;
    const usersBanned = users.filter( user => user.status === 1).length;
        
    return (
        <div className="container">
            <div className="flex-g">
                <h1>Users</h1>
                <DateComponent/>
            </div>
            <div className="flex-break"><br/></div>
            <div className="row">
                <Card color="blue" title="Otro" css="m-1 h-fit" md="2" sm="12">
                    <div className="card-header">
                        <div>My user details</div>
                        <CardMenu id="1">
                            <a onClick={() => setIsDisable(!isDisable)}>
                                Edit details
                            </a>
                        </CardMenu>
                    </div>
                    <div className="card-body d-flex flex-wrap">
                        <form onSubmit={handleSubmit}>
                            <div className="col-12 col-sm-12 m-2">
                                <p className="text-center avatar">
                                    <i className="fas fa-user-circle avatar" aria-hidden="true"></i>
                                </p>
                            </div>
                            <div className="flex-break"><br/></div>
                            
                            <div className="m-2">
                                <label className="col-12">Name:</label>
                                <input className="col-12" 
                                    type="text" 
                                    name="name"
                                    value={eName}
                                    onChange={handleInputChange}
                                    disabled={isDisable}/>
                            </div>
                            <div className="m-2">
                                <label className="col-12">Lastname:</label>
                                <input className="col-12" 
                                    type="text" 
                                    name="lastname"
                                    value={eLastname}
                                    onChange={handleInputChange}
                                    disabled={isDisable}/>
                            </div>
                            <div className="m-2">
                                <label className="col-12">Email:</label>
                                <input className="col-12" 
                                    type="text" 
                                    name="email"
                                    value={eEmail}
                                    onChange={handleInputChange}
                                    disabled={isDisable}/>
                            </div>
            
                            {
                                isDisable === false
                                && 
                                <BtnSubmit color="success" outline sm="12" md="12">
                                    <i className="fas fa-save mr-2"></i>
                                    Save
                                </BtnSubmit>
                            }
                        </form>
                    </div>
                </Card>
                
                <div className="subrow justify-content-se">
                    <Card color="success" sm="12" md="4" css="m-1">
                        <div className="card-header justify-content-center">
                            <div className="text-center">Active users</div>
                        </div>

                        <div className="card-body">
                            <p className="text-center active-user">
                                {usersActive}
                            </p>
                        </div>
                    </Card>
                    <Card color="danger" sm="12" md="4" css="m-1">
                        <div className="card-header justify-content-center">
                            <div className="text-center">Banned users</div>
                        </div>

                        <div className="card-body">
                            <p className="text-center banned-user">
                                {usersBanned}
                            </p>
                        </div>
                    </Card>
                    
                    <div className="flex-break"><br/></div>

                    <div className="subrow m-5">
                        <Table columns={colums} data={users}/>
                    </div>
                </div>

            </div>
        </div>
    )
}
