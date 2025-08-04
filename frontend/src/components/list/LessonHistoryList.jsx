import React, { useEffect, useState } from "react";
import { List, Card, Spin } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import useFetchApi from "../../hooks/useFetchApi";
import { endpoints } from "../../services/api";
import LessonHistoryDetail from "./LessonHistoryDetail";

const LessonHistoryList = () => {
  const { lessonId } = useParams();
  const {fetchApi} = useFetchApi();
  const navigate = useNavigate();
  const [historyList, setHistoryList] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const res = await fetchApi({
            url : endpoints['lesson_histories']
        });
        setHistoryList(res.data);
        console.log(res.data)
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchHistory();
  }, [lessonId]);

  return (
    <Spin spinning={loading}>
        <div className="flex flex-row w-full justify-between">

        <div className="max-h-96 overflow-y-auto overflow-x-hidden px-6">
            <List
                grid={{ gutter: 16, column: 1 }}
                dataSource={historyList}
                renderItem={(item) => (
                <List.Item>
                    <Card

                    hoverable
                    onClick={() => setHistory(item)}
                    title={ `${item.action} lúc #${new Date(item.created_at).toLocaleString()}`}
                    >
                    </Card>
                        </List.Item>
                )}
            />
        </div>
      
      <div className="flex-1">
        <LessonHistoryDetail historyId={history?.id}/>
      </div>
        </div>
    </Spin>
  );
};

export default LessonHistoryList;
