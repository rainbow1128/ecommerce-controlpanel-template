import React from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
} from "react-router-dom";

//Components
import { DashboardScreen } from './components/pages/dashboard/DashboardScreen';
import { ProductScreen } from './components/pages/products/ProductScreen';
import { UserScreen } from './components/pages/users/UserScreen';
import { CategoryScreen } from './components/pages/categories/CategoryScreen';

// Layout
import { NavBar } from './components/layout/NavBar';
import { Sidebar } from './components/layout/Sidebar';

export const Admin = () => {
    return (
        <>
            <div className="wrapper">
                <Router>
                    <Sidebar/>
                    <NavBar/>
                    <main>
                        <Switch>
                            <Route exact path="/" component={DashboardScreen}/>
                            <Route exact path="/users" component={UserScreen}/>
                            <Route exact path="/products" component={ProductScreen}/>
                            <Route exact path="/categories" component={CategoryScreen}/>
                            <Redirect to="/"/>
                        </Switch>
                    </main>
                </Router>
            </div>
        </>
    )
}
