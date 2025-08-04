import { Avatar } from "antd";
import avatarDefault from '../../assets/img/avatar.png'

const Review = ({review})=>{

    return(
    <div className="w-full ">

        <div className="w-full flex flex-col rounded-xl ">
          <div className="flex flex-row">
            <Avatar className='' shape='circle'  src = {review.user?.avatar || avatarDefault}></Avatar>
            <div className="w-full flex flex-col ml-4 shadow-md border pt-1 pb-4 px-4 rounded-md bg-white">
              <div className="flex flex-col">
                <div className="flex justify-items-start align-middle">
                    <span className='flex justify-center items-center text-md'>{`${review.user?.first_name} ${review.user?.last_name}`}</span>
                </div>
                <div className=" flex flex-1 px-6 py-3"><p> {review.comment}</p></div>
              </div>
            
            
            </div>
          </div>
        </div>
    </div>
    );
};
export default Review;