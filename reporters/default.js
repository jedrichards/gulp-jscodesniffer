var chalk = require('chalk');

module.exports = function (stream) {
    stream.on('data',function (file) {
        var result = file.jscs.result;
        if ( result.pass ) return;
        this.jscs.log('');
        this.jscs.log(chalk.bold.underline(result.dir+'/'+result.fileName));
        var self = this;
        result.messages.forEach(function (data) {
            var line = data.loc.start.line;
            self.jscs.log(chalk.red.bold('✖ L%s %s'),line,data.sniff);
            self.jscs.log(chalk.gray(data.message));
        });
    });
    stream.once('end',function () {
        if ( !this.jscs.success ) this.jscs.log(chalk.bold.underline.red('\n%s of %s files failed jscodesniffer\n'),this.jscs.failCount,this.jscs.results.length);
    });
}
