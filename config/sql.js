module.exports = {
  sql: {
    insert: 'insert into userInfo(username,password) values(?,?)', // 插入数据
    drop: 'drop table userInfo', // 删除表中所有的数据
    selectAll: 'select *from userInfo', // 查找表中所有数据
    selectUsername: 'select * from userInfo where username =?', // 通过用户名查找用户信息
    selectUser: 'select * from userInfo where username =? and password=?', // 通过用户名查找用户信息
  }
}