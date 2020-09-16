//包含程序相关功能的模块
//辅助函数： 发送HTML,创建表单，接收表单数据
let qs = require('querystring');

//发送HTML相应
exports.sendHtml = function(res, html) {
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Length', Buffer.byteLength(html));
    res.end(html);
};

//解析HTTP POST数据
exports.parseReceivedData = function(req, cb) {
    let body = '';
    req.setEncoding('utf8');
    req.on('data', (chunk) => { body += chunk });
    req.on('end', () => {
        let data = qs.parse(body);
        cb(data);
    })
}

//渲染简单的表单
exports.actionForm = function(id, path, label) {
    let html = `
    <form method="POST" action="${path}">
    <input type="hidden" name="id" value="${id}"/>
    <input type="submit"  value="${label}"/>
    </form>`;
    return html;
};

//添加工作记录
exports.add = function(db, req, res) {
    exports.parseReceivedData(req, (work) => {
        //添加工作记录的SQL
        db.query(`INSERT INTO work (hours, date, description) VALUES (?,?,?)`,
        [work.hours, work.date, work.description], //工作记录数据
        (err) => {
            if (err) throw err;
            exports.show(db, res); //给用户显示工作记录清单
        })
    })

}

//归档一条工作记录
exports.archive = function(db, req, res) {
    exports.parseReceivedData(req, (work) => {
        db.query(`UPDATE work SET archived=1 WHERE id=?`,
        [work.id],
        (err) => {
            if (err) throw err;
            exports.show(db, res);
        })
    })
}

//获取工作记录
exports.show = function(db, res, showArchived) {
    //获取工作记录的SQL
    let query = `SELECT * FROM work WHERE archived=? ORDER BY date DESC`;
    let archiveValue = (showArchived)? 1 : 0;
    db.query(
        query,
        [archiveValue], //想要的工作记录归档状态
        (err, rows) => {
            if (err) throw err;
            html = (showArchived)? '' : '<a href="/archived">Archived Work</a><br/>';
            html += exports.workHitlistHtml(rows); //将结果格式化为html表格
            html += exports.workFormHtml(); 
            exports.sendHtml(res, html); //给用户发送html相应
        }
    )
}

exports.showArchived = function(db, res) {
    exports.show(db, res, true) //只显示归档的工作记录
}

//将工作记录渲染为HTML表格
exports.workHitlistHtml = function(rows) {
    let html = `<table>`;
    for(let i in rows) {
        html += `<tr><td>${rows[i].date}</td><td>${rows[i].hours}</td><td>${rows[i].description}</td>`;
        if (!rows[i].archived) {
            html += `<td>${exports.workArchiveForm(rows[i].id)}</td>`
        }
        html += `<td>${exports.workDeleteForm(rows[i].id)}</td>`
    };
  
    html += `</tr></table>`;
};

//用来添加、归档、删除工作记录的HTML表单
exports.workFormHtml = function() {
    let html = `<form method="POST" action="/">
                <p>Date (YYYY-MM-DD):<br/><input name="date" type="text"></p>
                <p>Hours worked:<br/><input name="hours" type="text"></p>
                <p>Description:<br/><textarea name="description"></textarea></p>
                <input type="submit" value="Add"/></form>`;
    return html;
}

exports.workArchiveForm = function(id) {
    //渲染归档按钮表单
    return exports.actionForm(id, '/archive', 'Archive');
}

exports.workDeleteForm = function() {
    //渲染删除按钮表单
    return exports.actionForm(id, '/delete', 'Delete')
}
