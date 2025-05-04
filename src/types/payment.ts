export interface NewebPayTradeInfo {
  Status:  string;
  Message: string;
  Result:  {
    MerchantID:       string;
    Amt:              number;
    TradeNo:          string;
    MerchantOrderNo:  string;
    RespondType:      string;
    IP:               string;
    EscrowBank:       string;
    PaymentType:      string;
    PayTime:          string;
    PayerAccount5Code:string;
    PayBankCode:      string;
  };
}