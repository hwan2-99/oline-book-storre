var express = require("express");

var router = express.Router();

const pool = require("../../config/dbConfig");
module.exports = {
  // 카트에서 주문 바로 했을 때
  getCartOrder: async (userNum) => {
    try {
      const conn = await pool.getConnection();
      const query = `
        SELECT  
           *
        FROM cart c
        join book b on b.book_num = c.book_book_num 
        where c.user_user_num = ?
      `;
      const [result] = await conn.query(query, [userNum]);
      conn.release();
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  // 책 바로 구매 진행할 경우
  getBookOrder: async (bookNum) => {
    try {
      const conn = await pool.getConnection();
      const query = `
        SELECT * FROM BOOK
        WHERE book_num = ?
      `;
      const [{ affectRows: result }] = await conn.query(query, [bookNum]);
      conn.release();
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  // 유저 카드 데이터 조회
  getCard: async (userNum) => {
    try {
      const conn = await pool.getConnection();
      const query = `
          SELECT * FROM card
          WHERE user_user_num = ?
        `;
      const [{ affectRows: result }] = await conn.query(query, [userNum]);
      conn.release();
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  // 유저 주소 데이터 조회
  getAddress: async (userNum) => {
    try {
      const conn = await pool.getConnection();
      const query = `
          SELECT * FROM address
          WHERE user_user_num = ?
        `;
      const [{ affectRows: result }] = await conn.query(query, [userNum]);
      conn.release();
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  // 카드 데이터 뽑기 dom 접근하여 form에 추가하기
  getCardPick: async (cardNum) => {
    try {
      const conn = await pool.getConnection();
      const query = `
            SELECT * FROM card
            WHERE card_num = ?
          `;
      const [{ affectRows: result }] = await conn.query(query, [cardNum]);
      conn.release();
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  // 계좌 데이터 뽑기 dom 접근하여 form에 추가하기
  getAddressPick: async (addressNum) => {
    try {
      const conn = await pool.getConnection();
      const query = `
            SELECT * FROM address
            WHERE address_num = ?
          `;
      const [{ affectRows: result }] = await conn.query(query, [addressNum]);
      conn.release();
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  // 총액계산
  plusOrder: async (price, order_num) => {
    try {
      const conn = await pool.getConnection();
      const query = `
            update orders set order_total = ? where order_num = ?
          `;
      await conn.query(query, [price, order_num]);
      conn.release();
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  // 주문하기
  insertOrder: async (orderInfo, userNum) => {
    try {
      const {} = orderInfo;
      const conn = await pool.getConnection();
      const query = `
              insert into orders(
                order_date,
                order_zip_code,
                order_default_address,
                order_detail_address,
                order_card_valid_date,
                order_card_num,
                order_card_type,
                order_total,
                user_user_num
              ) values(
                NOW(),
                ?,
                ?,
                ?,
                NOW(),
                ?,
                ?,
                0,
                ?
            )
            `;
      const [{ insertId: result }] = await conn.query(query, [
        orderInfo.order_zip_code,
        orderInfo.order_default_address,
        orderInfo.order_detail_address,
        orderInfo.order_card_num,
        orderInfo.order_card_type,
        userNum,
      ]);
      conn.release();
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  // 책 주문 저장하기
  insertBookOrder: async (order_num, orderBookInfo) => {
    try {
      const conn = await pool.getConnection();
      const query = `
              insert into book_order(
                Order_order_num,
                Book_book_num,
                book_order_price
              ) values(
                ?,
                ?,
                ?
            )
            `;
      const [{ affectRows: result }] = await conn.query(query, [
        order_num,
        orderBookInfo.book_book_num,
        orderBookInfo.book_price,
      ]);
      conn.release();
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
};
