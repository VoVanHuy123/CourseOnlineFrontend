import React, { useEffect, useState } from 'react';
import { Avatar,Collapse , Button, Drawer } from 'antd';
import avatarDefault from '../../assets/img/avatar.png'
import useFetchApi from '../../hooks/useFetchApi';
import { endpoints } from '../../services/api';
import CreateCommentForm from '../form/CreateCommentForm';
const CommentArea = ({lesson}) => {
  const {loading,fetchApi} = useFetchApi();
  const [open, setOpen] = useState(false);
  const [commentList, setCommentList] = useState([]);
  const [createCommentTo, setCreateCommentTo] = useState(null);
  const { Panel } = Collapse;

  const [showCreateComment,setShowCreateComment] = useState(false)
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  const loadComments = async (url) =>{
    try {
      const commentsResponse = await fetchApi({
        url:url,
      });
      if(commentsResponse.status===200){
        setCommentList(commentsResponse.data);
      }
    } catch (error) {
      console.log(error)
    }
  };
  const handleSetReply = (newReply, parentCommentId) => {
    setCommentList((prevList) =>
      prevList.map((comment) => {
        if (comment.id === parentCommentId) {
          // Thêm reply mới vào replies[]
          return {
            ...comment,
            replies: [...(comment.replies || []), newReply],
          };
        }
        return comment;
      })
    );
    setCreateCommentTo({isReply:false, commentId: null, lessonId:null });
  };
  const handleSetNewComment = (newComment, replyTo) => {
    setCommentList([newComment,...commentList]);
    
    setCreateCommentTo({isReply:false, commentId: null, lessonId:null });
  };

  useEffect(()=>{
    console.log(lesson)
    if (!lesson) return; // kiểm tra lesson có giá trị không

    const url = `${endpoints.get_comments}?lesson_id=${lesson.id}`;
    loadComments(url);
  },[lesson])
  
  const Comment = ({comment}) =>(
    <div className="w-full ">

        <div className="w-full flex flex-col rounded-xl ">
          <div className="flex flex-row">
            <Avatar className='' shape='square' src = {comment.user.avatar || avatarDefault}></Avatar>
            <div className="w-full flex flex-col ml-4 shadow-md border pt-1 pb-4 px-4 rounded-md">
              <div className="flex flex-col">
                <div className="flex justify-items-start align-middle">
                    <span className='flex justify-center items-center text-md'>{`${comment.user.first_name} ${comment.user.last_name}`}</span>
                </div>
                <div className=" flex flex-1 bg-white"> {comment.content}</div>
              </div>
            {createCommentTo?.isReply ? 
              <div className="flex flex-1 text-right justify-items-end ml-auto"><span onClick={(e)=>{
                setCreateCommentTo({isReply:false, commentId: comment?.id, lessonId: lesson?.id });
                e.stopPropagation();

              }}>Đóng</span></div>
            :
              <div className="flex flex-1 text-right justify-items-end ml-auto"><span onClick={(e)=>{
                setCreateCommentTo({isReply:true, commentId: comment?.id, lessonId: lesson?.id });
                
                e.stopPropagation();

              }}>Trả lời</span></div>
            }
            
            </div>
          </div>
          {CreateReply()}
        </div>
    </div>
  );
  const Reply = ({reply}) =>(
    <div className="w-full px-4 py-4 bg-blue-100 rounded-md">
        <div className="w-full flex flex-row rounded-xl">
                  <Avatar shape='square' src ={reply.user.avatar || avatarDefault}></Avatar>
            <div className="w-full ml-4 bg-white pb-4 px-4 rounded-md bg-blue-100">
                <div className="flex justify-items-start align-middle mb-2">
                    <span className='flex justify-center items-center text-md'>{`${reply.user.first_name} ${reply.user.last_name}`}</span>
                </div>
                <div className=""> {reply.content}</div>
            </div>
        </div>
    </div>
  );
  const CreateReply = () => {
    if(createCommentTo?.isReply) {
      return(
        <CreateCommentForm onSet={handleSetReply}  lesson_id={createCommentTo.lessonId} reply_to={createCommentTo.commentId}/>
      );
    }else return null;
  }
  if(loading) return <div className="">loading comment ...</div>
  return (
    <div className=" w-full flex flex-col h-full rounded-2xl">
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400 custom-scrollbar" >
        <Collapse style={{
          border:0,
          padding: 0
        }} className='w-full bg-white p-0'>
          
          {commentList.map((comment)=>(
              <Panel
                  className='w-full p-0 bg-white' 
                  key={comment.id} 
                  showArrow={false}
                  header={<Comment comment={comment}/>} 
              >
                
                {comment.replies?.map((reply) => (
                  <div key={reply.id} className="pl-10 pb-4">
                    <Reply reply={reply} />
                  </div>
                ))}
              </Panel>
          ))}
      </Collapse>
      </div>
          <div className="pt-4">
          {showCreateComment ? 
            <div className="relative">
              <CreateCommentForm lesson_id={lesson?.id} onSet={handleSetNewComment}/>
              <Button 
                onClick={() =>{
                setShowCreateComment(false)
              }} 
                className='absolute bottom-1' 
                type='primary'> Đóng</Button>
            </div>

            :
            <Button
              onClick={() =>{
                setShowCreateComment(true)
              }} 
              type='primary'>Comment</Button>
          }
          </div>
    </div>
  );
};
export default CommentArea;