import { EOL } from 'node:os';
import { Table } from '@cliffy/table';

export class Output {
  static display(msg: string, suppressEol = false) {
    Deno.stdout.writeSync(new TextEncoder().encode(msg));
    if (!suppressEol) {
      Deno.stdout.writeSync(new TextEncoder().encode(EOL));
    }
  }

  static displayTable(rows: string[][], headers: string[] = []) {
    const table = new Table();
    if (headers && headers.length > 0) {
      table.header(headers);
    }
    table.body(rows);
    table.border(false);
    this.display(table.toString());
  }
}
