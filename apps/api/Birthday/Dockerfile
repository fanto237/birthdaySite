FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY apps/api/Birthday/Birthday.csproj apps/api/Birthday/
RUN dotnet restore apps/api/Birthday/Birthday.csproj

COPY apps/api/Birthday/ apps/api/Birthday/
RUN dotnet publish apps/api/Birthday/Birthday.csproj -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

RUN mkdir -p /app/data

COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "Birthday.dll"]
