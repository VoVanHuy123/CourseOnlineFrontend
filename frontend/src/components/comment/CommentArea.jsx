import React, { useEffect, useState } from 'react';
import { Avatar,Collapse , Button, Drawer } from 'antd';
import avatarDefault from '../../assets/img/avatar.png'
import useFetchApi from '../../hooks/useFetchApi';
import { endpoints } from '../../services/api';
const CommentArea = ({lesson}) => {
  const {loading,fetchApi} = useFetchApi();
  const [open, setOpen] = useState(false);
  const [commentList, setCommentList] = useState([]);
  const { Panel } = Collapse;
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
            <Avatar shape='square' src = {comment.user.avatar || avatarDefault}></Avatar>
            <div className="w-full flex flex-col ml-4 shadow-2xl pt-1 pb-4 px-4 rounded-md">
              <div className="flex flex-col">
                <div className="flex justify-items-start align-middle">
                    <span className='flex justify-center items-center text-md'>{`${comment.user.first_name} ${comment.user.last_name}`}</span>
                </div>
                <div className=" flex flex-1 bg-white"> {comment.content}</div>
              </div>
            <div className="flex flex-1 text-right justify-items-end ml-auto">Trả lời</div>
            </div>
          </div>
            
        </div>
    </div>
  );
  const Reply = ({reply}) =>(
    <div className="w-full px-4 pt-4 bg-blue-100 rounded-md">
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
  if(loading) return <div className="">loading comment ...</div>
  return (
    <div className=" w-full rounded-2xl">
      <div className="mb-4 ml-2">

      <h2>Comment: {lesson.title}</h2>
      </div>
      {/* <Collapse showArrow={false} className='w-full' items={items} defaultActiveKey={['1']} />; */}
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
                <div key={reply.id} className="pl-10">
                  <Reply reply={reply} />
                </div>
              ))}
            </Panel>
        ))}
    </Collapse>
    </div>
  );
};
export default CommentArea;