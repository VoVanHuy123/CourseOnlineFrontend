import React, { useContext, useEffect, useState } from 'react';
import { Avatar, Button, List, Skeleton, Popconfirm, message } from 'antd';
import useFetchApi from '../../hooks/useFetchApi';
import { endpoints } from '../../services/api';
import avatarDefault from '../../assets/img/avatar.png';
import Review from './Review';
import CreateReview from '../form/CreateReviewForm';
import { AuthContext } from '../../context/AuthContext';
import EditReviewForm from '../form/UpdateReview';

const PAGE_SIZE = 5;

const ReviewList = ({ courseId }) => {
    const { fetchApi, loading } = useFetchApi();
    const [initLoading, setInitLoading] = useState(true);
    const [list, setList] = useState([]);
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [openReview, setOpenReview] = useState(false);
    const [newReview, setNewReview] = useState(null)
    const { user,isAuthenticated } = useContext(AuthContext);
    const [editId, setEditId] = useState(null);


    const loadReviews = async (currentPage) => {
        try {
            const response = await fetchApi({
                url: `${endpoints["get_reviews"]}?course_id=${courseId}&page=${currentPage}&per_page=${PAGE_SIZE}`,
            });

            console.log(response.data)
            if (Array.isArray(response.data)) {
                const newList = currentPage === 1 ? response.data : [...data, ...response.data];
                setList(newList);
                setData(newList);
                setHasMore(response.data.length === PAGE_SIZE);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setInitLoading(false);
        }
    };

    useEffect(() => {
        if (courseId) {
            loadReviews(1);
        }
    }, [courseId]);
    useEffect(() => {
        if (newReview) {
            setList([
                newReview,
                ...list
            ])
        }

    }, [newReview]);

    const onLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        loadReviews(nextPage);
    };

    const handleDelete = async (reviewId) => {
        try {
            const res = await fetchApi({
                url: `${endpoints['reviews']}/${reviewId}`,
                method: 'DELETE',
            });
            if (res.status === 200) {
                setList((prev) => prev.filter((r) => r.id !== reviewId));
                message.success('Đã xóa review');
            }
        } catch (err) {
            message.error('Xóa thất bại');
            console.error(err);
        }
    };

    const loadMore =
        !initLoading && hasMore ? (
            <div style={{ textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px' }}>
                <Button onClick={onLoadMore}>Tải thêm</Button>
            </div>
        ) : null;
    if(!isAuthenticated) return null;
    return (
        <div className="bg-white rounded-lg shadow-sm p-4 w-full">
            <div className="flex flex-row justify-items-stretch justify-between">
                
                <h3 className="flex text-lg font-semibold mb-4">Đánh giá khóa học</h3>
                {user.role == "student"? <Button className='mb-6 bg-[#93DA97] text-gray' onClick={() => setOpenReview(true)}>Tạo đánh giá</Button> :<></>}
            </div>
            
            <List
                itemLayout="horizontal"
                dataSource={list}
                loading={initLoading}
                loadMore={loadMore}
                renderItem={(item) => (
                    <List.Item
                    // className='bg-white'
                        key={item.id}
                        
                        actions={
                            item.user_id === user.id &&  user.role == "student"
                                ? [
                                    <Button  className='bg-[#447D9B] font-semibold text-white' onClick={() => setEditId(item.id)}>Sửa</Button>,
                                    <Popconfirm
                                        title="Bạn có chắc chắn muốn xóa?"
                                        onConfirm={() => handleDelete(item.id)}
                                        okText="Xóa"
                                        cancelText="Hủy"
                                    >
                                        <a className='bg-[#DC3C22] text-white rounded-md py-1.5 px-4' style={{ color: 'white' }}>Xóa</a>
                                    </Popconfirm>
                                ]
                                : []
                        }
                    >
                        <Skeleton avatar title={false} loading={item.loading} active>
                            {editId === item.id ? (
                                <div className="w-full border px-6 py-3 my-8 rounded-md shadow-md">

                                    <EditReviewForm
                                        review={item}
                                        onCancel={() => setEditId(null)}
                                        onSuccess={(updated) => {
                                            setList(prev => prev.map(r => r.id === item.id ? updated : r));
                                        }}
                                    />
                                </div>
                            ) : (
                                <Review review={item} />
                            )}
                        </Skeleton>
                    </List.Item>
                )}
            />


            <CreateReview
                courseId={courseId}
                visible={openReview}
                onClose={() => setOpenReview(false)}
                onSuccess={() => loadReviews()} // callback load lại
                onReturnReview={(review) => setNewReview(review)}
            />
        </div>
    );
};

export default ReviewList;
