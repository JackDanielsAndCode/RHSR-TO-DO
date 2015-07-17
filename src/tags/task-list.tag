<task-list>
  <task each="{el in opts.items}" item={ el } ></task>
  <script>
      this.socket = opts.socket;
  </script>
</task-list>
