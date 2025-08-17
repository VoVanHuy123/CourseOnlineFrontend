import React, { useContext, useEffect, useState } from 'react';
import { Button, Drawer } from 'antd';
import CommentArea from '../comment/CommentArea';
import CreateCommentForm from '../form/CreateCommentForm';
import { AuthContext } from '../../context/AuthContext';

const CommentDrawer = ({selectedLesson,open,onClose}) => {
  const {user} = useContext(AuthContext);
  const [selectedLessonn, setSelectedLessonn] = useState(false);
  const [showCreateComment,setShowCreateComment] = useState(false)
  useEffect (()=>{
    if(selectedLesson) setSelectedLessonn(selectedLesson)
  },[selectedLesson])
  return (
    <>
      <Drawer
        width={600}
        title={`Comment: ${selectedLessonn ? selectedLesson?.title : ""}`}
        closable={{ 'aria-label': 'Close Button' }}
        onClose={onClose}
        open={open}
      >
        

            <CommentArea lesson={selectedLessonn}/>
          

      </Drawer>
    </>
  );
};
export default CommentDrawer;