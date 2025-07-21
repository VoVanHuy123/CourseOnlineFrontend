import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Result, Button, Spin, Card, Descriptions } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined, LoadingOutlined } from "@ant-design/icons";

const PaymentReturnPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [paymentResult, setPaymentResult] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState({});

  useEffect(() => {
    const processPaymentReturn = () => {
      setLoading(true);
      
      // Get all URL parameters
      const params = Object.fromEntries(searchParams.entries());
      console.log("Payment return parameters:", params);
      
      // Determine payment method based on parameters
      let paymentMethod = "unknown";
      let isSuccess = false;
      let transactionInfo = {};

      // VNPay return parameters
      if (params.vnp_ResponseCode !== undefined) {
        paymentMethod = "vnpay";
        isSuccess = params.vnp_ResponseCode === "00";
        transactionInfo = {
          orderId: params.vnp_TxnRef,
          amount: params.vnp_Amount ? (parseInt(params.vnp_Amount) / 100).toLocaleString() : "N/A",
          transactionNo: params.vnp_TransactionNo,
          bankCode: params.vnp_BankCode,
          payDate: params.vnp_PayDate,
          responseCode: params.vnp_ResponseCode,
          message: getVNPayMessage(params.vnp_ResponseCode)
        };
      }
      // MoMo return parameters
      else if (params.resultCode !== undefined) {
        paymentMethod = "momo";
        isSuccess = params.resultCode === "0";
        transactionInfo = {
          orderId: params.orderId,
          amount: params.amount ? parseInt(params.amount).toLocaleString() : "N/A",
          transactionId: params.transId,
          resultCode: params.resultCode,
          message: getMoMoMessage(params.resultCode)
        };
      }
      // Handle case where no recognized parameters are found
      else {
        console.error("No recognized payment parameters found");
        setPaymentResult({
          success: false,
          title: "Lỗi xử lý thanh toán",
          message: "Không thể xác định kết quả thanh toán. Vui lòng liên hệ hỗ trợ."
        });
        setLoading(false);
        return;
      }

      // Set payment result
      setPaymentResult({
        success: isSuccess,
        title: isSuccess ? "Thanh toán thành công!" : "Thanh toán thất bại",
        message: isSuccess 
          ? `Bạn đã thanh toán thành công qua ${paymentMethod.toUpperCase()}. Bạn có thể bắt đầu học ngay bây giờ.`
          : `Thanh toán qua ${paymentMethod.toUpperCase()} không thành công. ${transactionInfo.message}`
      });

      setPaymentInfo({
        method: paymentMethod,
        ...transactionInfo
      });

      setLoading(false);
    };

    processPaymentReturn();
  }, [searchParams]);

  const getVNPayMessage = (responseCode) => {
    const messages = {
      "00": "Giao dịch thành công",
      "07": "Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).",
      "09": "Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.",
      "10": "Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần",
      "11": "Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.",
      "12": "Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa.",
      "13": "Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP).",
      "24": "Giao dịch không thành công do: Khách hàng hủy giao dịch",
      "51": "Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.",
      "65": "Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.",
      "75": "Ngân hàng thanh toán đang bảo trì.",
      "79": "Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định."
    };
    return messages[responseCode] || "Lỗi không xác định";
  };

  const getMoMoMessage = (resultCode) => {
    const messages = {
      "0": "Giao dịch thành công",
      "9000": "Giao dịch được khởi tạo, chờ người dùng xác nhận thanh toán",
      "8000": "Giao dịch đang được xử lý",
      "7000": "Giao dịch bị từ chối bởi người dùng",
      "6000": "Giao dịch bị từ chối bởi ngân hàng",
      "5000": "Giao dịch bị từ chối (ngân hàng từ chối giao dịch)",
      "4000": "Giao dịch bị từ chối do vi phạm quy tắc giao dịch",
      "3000": "Giao dịch bị hủy",
      "2000": "Giao dịch thất bại do lỗi hệ thống",
      "1000": "Giao dịch thất bại do lỗi từ MoMo",
      "11": "Truy cập bị từ chối",
      "12": "Phiên bản API không được hỗ trợ cho yêu cầu này",
      "13": "Merchant authentication failed",
      "20": "Bad request",
      "21": "Invalid signature"
    };
    return messages[resultCode] || "Lỗi không xác định";
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  const handleBackToCourse = () => {
    if (paymentInfo.orderId) {
      // You might want to navigate to the specific course
      // For now, navigate to home
      navigate("/");
    } else {
      navigate("/");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="text-center p-8">
          <Spin 
            indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} 
            size="large" 
          />
          <div className="mt-4 text-lg">Đang xử lý kết quả thanh toán...</div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <Card className="shadow-lg">
          <Result
            icon={
              paymentResult?.success ? (
                <CheckCircleOutlined style={{ color: "#52c41a", fontSize: "72px" }} />
              ) : (
                <CloseCircleOutlined style={{ color: "#ff4d4f", fontSize: "72px" }} />
              )
            }
            title={paymentResult?.title}
            subTitle={paymentResult?.message}
            extra={[
              <Button 
                type="primary" 
                key="course" 
                onClick={handleBackToCourse}
                disabled={!paymentResult?.success}
                className={paymentResult?.success ? "bg-blue-500" : ""}
              >
                {paymentResult?.success ? "Bắt đầu học" : "Thử lại"}
              </Button>,
              <Button key="home" onClick={handleBackToHome}>
                Về trang chủ
              </Button>
            ]}
          />
          
          {/* Payment Details */}
          <div className="mt-8 border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Chi tiết giao dịch</h3>
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Phương thức thanh toán">
                {paymentInfo.method?.toUpperCase() || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Mã đơn hàng">
                {paymentInfo.orderId || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Số tiền">
                {paymentInfo.amount ? `${paymentInfo.amount} VNĐ` : "N/A"}
              </Descriptions.Item>
              {paymentInfo.method === "vnpay" && (
                <>
                  <Descriptions.Item label="Mã giao dịch">
                    {paymentInfo.transactionNo || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Ngân hàng">
                    {paymentInfo.bankCode || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Thời gian thanh toán">
                    {paymentInfo.payDate || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Mã phản hồi">
                    {paymentInfo.responseCode || "N/A"}
                  </Descriptions.Item>
                </>
              )}
              {paymentInfo.method === "momo" && (
                <>
                  <Descriptions.Item label="Mã giao dịch MoMo">
                    {paymentInfo.transactionId || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Mã kết quả">
                    {paymentInfo.resultCode || "N/A"}
                  </Descriptions.Item>
                </>
              )}
              <Descriptions.Item label="Trạng thái">
                <span className={paymentResult?.success ? "text-green-600" : "text-red-600"}>
                  {paymentInfo.message || "N/A"}
                </span>
              </Descriptions.Item>
            </Descriptions>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PaymentReturnPage;
