import React from 'react';

function Profile({ user }) {
    return (
        <div>
            <div class="modal fade" id="exampleModal" tabIndex={"-1"} aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content text-center">
                        <div class="modal-header">
                            <h1 class="modal-title exampleModal fs-5" id="exampleModalLabel">My Profile</h1>
                        </div>
                        <div class="modal-body">
                            <div className='viewProfile'>
                                <img class="img-profile rounded-circle"
                                src={user.image} style={{ width:"150px" }} />
                            </div> 
                                <div className='mt-4'><i class="fa-solid fa-user mr-2"></i>{user.name}</div>
                                <div className='mt-2'><i class="fa-solid fa-envelope mr-2"></i>{user.email}</div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile