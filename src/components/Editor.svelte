<script lang="ts">
	import CodeMirror from 'svelte-codemirror-editor';
	import { javascript } from '@codemirror/lang-javascript';

	let { game }: any = $props();

	let value = $state(`{
    init: function(elevators, floors) {
        let elevator = elevators[1];
        elevator.on("idle", function() {
            console.log('on:idle', 'elevator', this.index);
            this.goToFloor(1);
            this.goToFloor(2);
            this.goToFloor(3);
            this.goToFloor(4);
            this.goToFloor(5);
        });

        elevator = elevators[0];
        elevator.on("idle", function() {
            console.log('on:idle', 'elevator', this.index);
            this.goToFloor(5);
            this.goToFloor(4);
            this.goToFloor(3);
            this.goToFloor(2);
            this.goToFloor(1);
        });
    }
}`);

	$inspect({ value });

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
