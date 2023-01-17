import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../Components/ChatPage/SideDrawer';
import { getSender } from '../../config/ChatLogic';
import { ChatState } from '../../Context/Chatprovider';
import Profile from '../Modal/Profile';
import './sb-admin-2.min.css';
import Sidebar from './Sidebar';

function SideDrawer() {

  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  const [show, setShow] = useState(false);

  const { user, setselectedChat, chats, setchats, Notification, setNotification } = ChatState();
  const navigate = useNavigate();

  function showList() {
    if (show) {
      setShow(false);
    } else {
      setShow(true);
    }
  }

  const logOut = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  }

  function openSideNav() {
    var width = document.getElementById("mySidenav").style.width;
    if (width === "300px") {
      document.getElementById("mySidenav").style.width = "0px";
    } else {
      document.getElementById("mySidenav").style.width = "300px";
    }
  }

  return (
    <div id="content-wrapper" class="d-flex flex-column">
      <div id="content">
        <nav class="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">

          <button id="sidebarToggleTop" class="btn btn-link d-md-none rounded-circle mr-3">
            <i class="fa fa-bars"></i>
          </button>

          <form
            class="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
            <div class="input-group">
              <div class="input-group-append">
                <button class="btn btn-light sidebar-search" type="button" onClick={openSideNav}>
                  <i class="fas fa-search fa-sm mr-3"></i>Search User
                </button>
              </div>
            </div>
          </form>

          <Sidebar user={user} />

          <div className='appName container'>Chat-On</div>

          <ul class="navbar-nav ml-auto">
            <li class="nav-item dropdown no-arrow d-sm-none">
              <a class="nav-link dropdown-toggle" href="#" id="searchDropdown" role="button"
                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i class="fas fa-search fa-fw"></i>
              </a>
              <div class="dropdown-menu dropdown-menu-right p-3 shadow animated--grow-in"
                aria-labelledby="searchDropdown">
                <form class="form-inline mr-auto w-100 navbar-search">
                  <div class="input-group">
                    <input type="text" class="form-control bg-light border-0 small"
                      placeholder="Search for..." aria-label="Search"
                      aria-describedby="basic-addon2" />
                    <div class="input-group-append">
                      <button class="btn btn-primary" type="button">
                        <i class="fas fa-search fa-sm"></i>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </li>



            <li class="nav-item no-arrow mx-1" style={{cursor:"pointer"}}>
              <a class="nav-link dropdown-toggle" id="alertsDropdown" role="button"
                data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i class="fas fa-bell fa-fw fa-lg" style={{ paddingLeft: "20px" }}></i>
                <span class="badge badge-danger badge-counter">{!Notification.length ? "" : Notification.length}</span>
              </a>
              <div class="dropdown-list dropdown dropdown-menu dropdown-menu-right shadow animated--grow-in"
                aria-labelledby="alertsDropdown" style={{ marginLeft: "1000px" }}>
                <h6 class="dropdown-header text-center">
                  Alerts Center
                </h6>
                {
                  Notification.map((notify) => {
                    return <a class="dropdown-item d-flex align-items-center" key={notify._id} onClick={()=>{
                      setselectedChat(notify.chat)
                      setNotification(Notification.filter((n)=> n !== notify))
                      }}>
                      <div>
                        <span class="font-weight-bold">{
                          notify.chat.isGroupChat ?
                            `New Message in ${notify.chat.chatName}` :
                            `New Message from ${getSender(user, notify.chat.users)}`
                        }
                        </span>
                      </div>
                    </a>
                  })
                }
                <a class="dropdown-item text-center small text-gray-500">
                  {!Notification.length && "No New Message"}
                </a>
              </div>
            </li>

            <div class="topbar-divider d-none d-sm-block"></div>

            <li class="nav-item dropdown no-arrow">
              <a class="nav-link dropdown-toggle" id="userDropdown" role="button"
                data-bs-toggle="dropdown" >
                <span class="mr-2 d-none d-lg-inline text-gray-600 small">{user.name}</span>
                <img class="img-profile rounded-circle mr-1"
                  src={user.image} />
                  <i class="fa-solid fa-caret-down" style={{ marginRight: "15px" }} ></i>
              </a>
              <div class="dropdown-menu dropdown-menu-right shadow animated--grow-in"
                aria-labelledby="userDropdown">
                <a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#exampleModal">
                  <i class="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                  My Profile
                </a>
                <a class="dropdown-item" onClick={logOut}>
                  <i class="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                  Logout
                </a>
              </div>
            </li>
            <Profile user={user} />
          </ul>
        </nav>
      </div>
    </div >
  )
}

export default SideDrawer