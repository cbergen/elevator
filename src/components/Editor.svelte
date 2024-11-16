<script lang="ts">
	import CodeMirror from 'svelte-codemirror-editor';
	import { javascript } from '@codemirror/lang-javascript';

	let { game }: any = $props();

	let value = $state(`{
    init: function(elevators, floors) {
        let elevator = elevators[1];
        elevator.on("idle", function() {
            this.goToFloor(1);
            this.goToFloor(2);
            this.goToFloor(3);
            this.goToFloor(4);
            this.goToFloor(5);
        });
    }
}`);

	$effect(() => {
		game.userCodeString = value;
	});
</script>

<div class="editor">
	<CodeMirror bind:value lang={javascript()} />
</div>

<style>
	.editor {
		margin-top: 2rem;
		border: 1px solid;
	}
</style>
