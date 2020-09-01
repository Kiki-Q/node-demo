#初始化项目npm init
#设计数据库结构
1.sequlize库(npm i -S sequelize、npm i -D sequlize-cli)
查看命令：.\node_modules\.bin\sequelize
初始化：.\node_modules\.bin\sequelize init（迁移文件、模型文件、种子文件、配置文件）

#设置响应头
res.setHeader(field, value)
res.getHeader(field)
res.removeHeader(field)
res.statusCode
#设置编码
req.setEncoding(encoding)

#高层流式硬盘访问
fs.ReadStream