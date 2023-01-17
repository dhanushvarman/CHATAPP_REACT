import React from 'react'

function ChatProfile({ user }) {
    return (
        <div class="modal fade" id="ChatProfile" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content ">
                    <div class="modal-header chatProfile-border">
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body container chatProfile">
                        <div style={{width:"180px"}}><img className='rounded-circle mb-2' style={{ height:"200px",width:"300px" }} src={user.image}/></div>
                        <div className='mt-3' style={{fontSize:"medium"}}><i class="fa-solid fa-user mr-2"></i>{user.name}</div>
                        <div className='mt-3' style={{fontSize:"medium"}}><i class="fa-solid fa-envelope mr-2"></i>{user.email}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatProfile