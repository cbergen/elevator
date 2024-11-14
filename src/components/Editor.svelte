<script lang="ts">
	import CodeMirror from 'svelte-codemirror-editor';
	import { javascript } from '@codemirror/lang-javascript';

	let { game }: any = $props();

	let value = $state(`{
    init: function(elevators, floors) {
        var elevator = elevators[0]; // Let's use the first elevator

        // Whenever the elevator is idle (has no more queued destinations) ...
        elevator.on("idle", function() {
            console.log('on:idle');

            // let's go to all the floors (or did we forget one?)
            elevator.goToFloor(1);
            elevator.goToFloor(2);
            elevator.goToFloor(3);
            elevator.goToFloor(4);
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
