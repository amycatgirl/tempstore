{
  description = "Development shell and packages for Tempstore";

  inputs = {
    nixpkgs.url = "https://channels.nixos.org/nixpkgs-unstable/nixexprs.tar.zst";
  };

  outputs = inputs: let
    supportedSystems = [ "x86_64-linux" "aarch64-linux" "aarch64-darwin"];
    forAllSystems = f: inputs.nixpkgs.lib.genAttrs supportedSystems (system: f system (builtins.getAttr system inputs.nixpkgs.legacyPackages));
  in {
    # TODO: nix package
    devShells = forAllSystems (system: pkgs: {
      default = pkgs.mkShell {
        buildInputs = with pkgs; [
          go
          gopls
          litecli
          just
        ];
      };
    });
  };
}
